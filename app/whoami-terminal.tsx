"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { projectCategories, projects } from "./project-data";
import { contact, owner } from "./site-config";

type Line = { kind: "input" | "output" | "accent" | "error"; text: string };

const PROMPT = "amin@dxb:~$";
const quickCommands = ["whoami", "stack", "projects", "contact", "hire"];

const categorySummary = projectCategories
  .filter((category) => category !== "All")
  .map((category) => `${category} ${projects.filter((project) => project.category === category).length}`)
  .join(" · ");

function respond(raw: string): Line[] | "clear" | { lines: Line[]; action: "contact" | "work" } {
  const command = raw.trim().replace(/\s+/g, " ");
  const lower = command.toLowerCase();
  if (!lower) return [];
  if (lower === "clear" || lower === "cls") return "clear";
  if (lower === "help" || lower === "?" || lower === "ls") {
    return [
      { kind: "output", text: "whoami     who is behind this site" },
      { kind: "output", text: "stack      tools across the whole stack" },
      { kind: "output", text: "projects   what is in the index" },
      { kind: "output", text: "status     availability" },
      { kind: "output", text: "contact    how to reach me" },
      { kind: "output", text: "work       open the full project index" },
      { kind: "output", text: "hire       jump to the project brief" },
      { kind: "output", text: "clear      clear the screen" },
    ];
  }
  if (lower === "whoami") {
    return [
      { kind: "accent", text: `${owner.name.toLowerCase()} — ${owner.jobTitle.toLowerCase()}` },
      { kind: "output", text: "designs interfaces · builds apps and APIs · runs infrastructure, security and SAP" },
      { kind: "output", text: `based in ${owner.locality}, ${owner.countryName}` },
    ];
  }
  if (lower === "stack") {
    return [
      { kind: "output", text: "design     web · ui/ux · motion · bilingual EN/AR" },
      { kind: "output", text: "front      react · next.js · vite · tailwind · three.js (r3f)" },
      { kind: "output", text: "back       node · express · fastapi · postgresql/postgis · mysql" },
      { kind: "output", text: "infra      proxmox · windows server · active directory · fortigate" },
      { kind: "output", text: "security   gpo · laps · applocker · defender/asr" },
      { kind: "output", text: "erp        sap business one · hana · sql reporting" },
    ];
  }
  if (lower === "projects" || lower === "ls projects") {
    return [
      { kind: "accent", text: `${projects.length} case studies` },
      { kind: "output", text: categorySummary },
      { kind: "output", text: "type `work` to open the full index" },
    ];
  }
  if (lower === "status" || lower === "uptime") {
    return [{ kind: "accent", text: "● available for select projects · Dubai (GMT+4)" }];
  }
  if (lower === "contact") {
    return [
      { kind: "output", text: `email      ${contact.email}` },
      { kind: "output", text: `whatsapp   ${contact.phoneDisplay}` },
      { kind: "output", text: "type `hire` to open the project brief" },
    ];
  }
  if (lower === "work" || lower === "cd work") {
    return { lines: [{ kind: "accent", text: "opening /work …" }], action: "work" };
  }
  if (lower === "hire" || lower === "hire amin" || lower === "sudo hire amin") {
    return { lines: [{ kind: "accent", text: "✔ request escalated — opening the project brief …" }], action: "contact" };
  }
  if (lower.startsWith("rm -rf")) {
    return [{ kind: "error", text: "denied by policy. this host is hardened — nice try." }];
  }
  if (lower.startsWith("sudo")) {
    return [{ kind: "error", text: "guest is not in the sudoers file. this incident will be reported. (try `sudo hire amin`)" }];
  }
  return [{ kind: "error", text: `command not found: ${command.slice(0, 40)} — type \`help\`` }];
}

const initialLines: Line[] = [
  { kind: "input", text: "whoami" },
  ...(respond("whoami") as Line[]),
];

export function WhoamiTerminal({ onContact, onWork }: { onContact: () => void; onWork: () => void }) {
  const [lines, setLines] = useState<Line[]>(initialLines);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const screenRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const screen = screenRef.current;
    if (screen) screen.scrollTop = screen.scrollHeight;
  }, [lines]);

  const execute = (raw: string) => {
    const result = respond(raw);
    if (raw.trim()) setHistory((current) => [raw, ...current].slice(0, 20));
    setHistoryIndex(-1);
    setValue("");
    if (result === "clear") {
      setLines([]);
      return;
    }
    const output = Array.isArray(result) ? result : result.lines;
    setLines((current) => [...current, { kind: "input" as const, text: raw.trim() }, ...output].slice(-40));
    if (!Array.isArray(result)) window.setTimeout(result.action === "contact" ? onContact : onWork, 450);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    execute(value);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp" && history.length) {
      event.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setValue(history[next]);
    } else if (event.key === "ArrowDown" && historyIndex >= 0) {
      event.preventDefault();
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setValue(next >= 0 ? history[next] : "");
    }
  };

  return (
    <div className="terminal">
      <div className="terminal-bar">
        <span aria-hidden="true"><i /><i /><i /></span>
        <b>{PROMPT.replace(":~$", "")} — zsh</b>
        <small>interactive</small>
      </div>
      {/* Clicking the screen is a pointer convenience; the input itself is keyboard reachable. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div className="terminal-screen" ref={screenRef} onClick={() => inputRef.current?.focus({ preventScroll: true })} data-lenis-prevent>
        <div role="log" aria-live="polite" aria-label="Terminal output">
          {lines.map((line, index) => (
            <p className={`terminal-line is-${line.kind}`} key={`${index}-${line.text}`}>
              {line.kind === "input" && <span className="terminal-prompt" aria-hidden="true">{PROMPT}</span>}
              {line.kind === "input" && <span className="sr-only">Command: </span>}
              {line.text}
            </p>
          ))}
        </div>
        <form className="terminal-form" onSubmit={onSubmit}>
          <label htmlFor="terminal-input" className="terminal-prompt">{PROMPT}<span className="sr-only"> Type a command, for example help</span></label>
          <input
            id="terminal-input"
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="send"
            placeholder="type help"
          />
        </form>
      </div>
      <div className="terminal-chips" role="group" aria-label="Run a quick command">
        {quickCommands.map((command) => (
          <button type="button" key={command} onClick={() => execute(command)}>{command}</button>
        ))}
      </div>
    </div>
  );
}
