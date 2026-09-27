"use client";

import { useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useModal } from "./use-modal";

export type Command = {
  id: string;
  group: "Navigate" | "Actions" | "Filter work" | "Case studies" | "Lab";
  label: string;
  hint?: string;
  keywords?: string;
  run: () => void;
};

const groupOrder: Command["group"][] = ["Actions", "Navigate", "Case studies", "Filter work", "Lab"];

function matches(command: Command, tokens: string[]) {
  const haystack = `${command.label} ${command.hint ?? ""} ${command.keywords ?? ""} ${command.group}`.toLowerCase();
  return tokens.every((token) => haystack.includes(token));
}

export function CommandPalette({ commands, onClose }: { commands: Command[]; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const baseId = useId();
  useModal(dialogRef, onClose, inputRef);

  const results = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = tokens.length ? commands.filter((command) => matches(command, tokens)) : commands;
    return groupOrder
      .map((group) => ({ group, items: filtered.filter((command) => command.group === group) }))
      .filter((section) => section.items.length > 0);
  }, [commands, query]);
  const flat = results.flatMap((section) => section.items);
  const active = flat[Math.min(activeIndex, flat.length - 1)];
  const optionId = (command: Command) => `${baseId}-${command.id}`;

  const run = (command: Command | undefined) => {
    if (!command) return;
    onClose();
    // Let the palette unmount (and focus return) before the command acts.
    window.requestAnimationFrame(() => command.run());
  };

  const move = (next: number) => {
    if (!flat.length) return;
    const index = (next + flat.length) % flat.length;
    setActiveIndex(index);
    document.getElementById(optionId(flat[index]))?.scrollIntoView({ block: "nearest" });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") { event.preventDefault(); move(activeIndex + 1); }
    else if (event.key === "ArrowUp") { event.preventDefault(); move(activeIndex - 1); }
    else if (event.key === "Home" && event.ctrlKey) { event.preventDefault(); move(0); }
    else if (event.key === "End" && event.ctrlKey) { event.preventDefault(); move(flat.length - 1); }
    else if (event.key === "Enter") { event.preventDefault(); run(active); }
  };

  return (
    <div className="palette-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="palette" role="dialog" aria-modal="true" aria-label="Command palette" ref={dialogRef}>
        <div className="palette-search">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={`${baseId}-list`}
            aria-activedescendant={active ? optionId(active) : undefined}
            aria-autocomplete="list"
            aria-label="Search sections, case studies and actions"
            placeholder="Jump to a section, case study or action…"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }}
            onKeyDown={onKeyDown}
          />
          <kbd>Esc</kbd>
        </div>
        <div className="palette-list" id={`${baseId}-list`} role="listbox" aria-label="Results" data-lenis-prevent>
          {results.map((section) => (
            <div role="group" aria-labelledby={`${baseId}-${section.group}`} key={section.group}>
              <div className="palette-group" id={`${baseId}-${section.group}`} role="presentation">{section.group}</div>
              {section.items.map((command) => (
                <div
                  className={`palette-option${command === active ? " is-active" : ""}`}
                  id={optionId(command)}
                  role="option"
                  aria-selected={command === active}
                  tabIndex={-1}
                  key={command.id}
                  onMouseMove={() => command !== active && setActiveIndex(flat.indexOf(command))}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => run(command)}
                  onKeyDown={(event) => event.key === "Enter" && run(command)}
                >
                  <span>{command.label}</span>
                  {command.hint && <small>{command.hint}</small>}
                  <i aria-hidden="true">↵</i>
                </div>
              ))}
            </div>
          ))}
          {!flat.length && <p className="palette-empty">No matches for “{query}”. Try “contact”, “SAP” or “React”.</p>}
        </div>
        <div className="palette-foot" aria-hidden="true">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>↵</kbd> select</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
