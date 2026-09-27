"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { CommandPalette, type Command } from "./command-palette";
import {
  featuredProjects,
  getProject,
  labExperiments,
  projectCategories,
  projects,
  type Project,
  type ProjectCategory,
} from "./project-data";
import { ProjectVisual } from "./project-visual";
import { contact, mailtoLink, owner, routeSeo, whatsappLink } from "./site-config";
import { FlightHud, SpaceCanvas } from "./space-canvas";
import { SITE_CONTENT_ID, useModal } from "./use-modal";
import { prefersReducedMotion, scrollToTarget, setScrollLock, useMotionSystem } from "./use-motion-system";
import { WhoamiTerminal } from "./whoami-terminal";

type View = "home" | "work";
type Category = "All" | ProjectCategory;
type SectionId = "about" | "work" | "stack" | "process" | "lab" | "contact";

const navItems: Array<{ id: SectionId | "all-work"; label: string }> = [
  { id: "all-work", label: "Work" },
  { id: "about", label: "About" },
  { id: "stack", label: "Stack" },
  { id: "process", label: "Process" },
  { id: "contact", label: "Contact" },
];

const liveProjects = projects.filter((project) => project.liveUrl);

const capabilities = [
  ["01", "Web design & art direction", "Distinct visual systems, typography and composition shaped for the screen — not borrowed templates."],
  ["02", "Creative front-end & 3D", "Responsive, accessible interfaces with purposeful motion, WebGL where it earns its place, and fast first paint."],
  ["03", "Full-stack products & APIs", "React and Next.js front ends on Node, Express or FastAPI with PostgreSQL, realtime features and authentication."],
  ["04", "Enterprise & internal systems", "CRM, ticketing, HR, dispatch and inventory tools shaped around how the business actually runs."],
  ["05", "Infrastructure & cybersecurity", "Virtualisation, identity, network segmentation, endpoint hardening, backup and disaster recovery."],
  ["06", "SAP Business One & reporting", "ERP workflows and HANA-backed reporting across inventory, warehouse, production and costing."],
];

const processSteps = [
  ["01", "Direction", "A clear visual idea, not a borrowed template.", "Mood · Type · Composition"],
  ["02", "Structure", "Hierarchy and journeys that make complex products feel simple.", "UX · Content · Systems"],
  ["03", "Interaction", "Motion and feedback that create rhythm without stealing attention.", "Motion · States · Detail"],
  ["04", "Build", "Responsive, accessible implementation that protects the design in the browser.", "React · APIs · Performance"],
  ["05", "Operate", "Hosting, identity, security and backups that keep it running after launch.", "Infrastructure · Security · Recovery"],
];

const disciplines = ["Web design", "UI / UX", "Creative front-end", "WebGL", "Full-stack", "APIs", "Infrastructure", "Cybersecurity", "SAP / ERP"];

type StackItem = { label: string; match?: string[] };
const stackGroups: Array<{ title: string; items: StackItem[] }> = [
  { title: "Design", items: [{ label: "Web design" }, { label: "UI / UX", match: ["UX"] }, { label: "Motion design" }, { label: "Bilingual EN / AR", match: ["Arabic"] }, { label: "Responsive design" }] },
  { title: "Front-end", items: [{ label: "React" }, { label: "Next.js" }, { label: "Vite" }, { label: "Tailwind CSS" }, { label: "Framer Motion" }, { label: "React Three Fiber" }, { label: "MapLibre GL" }, { label: "Electron" }] },
  { title: "Back-end & data", items: [{ label: "Node.js" }, { label: "Express" }, { label: "FastAPI" }, { label: "PostgreSQL" }, { label: "PostGIS" }, { label: "MySQL" }, { label: "Supabase" }, { label: "Socket.io" }, { label: "OR-Tools" }, { label: "Shopify Storefront API" }] },
  { title: "Infrastructure", items: [{ label: "Proxmox" }, { label: "Windows Server" }, { label: "Active Directory" }, { label: "DNS" }, { label: "FortiGate" }, { label: "VLANs" }, { label: "Site-to-site VPN" }, { label: "Docker Compose" }] },
  { title: "Security", items: [{ label: "GPO" }, { label: "LAPS" }, { label: "AppLocker" }, { label: "Microsoft Defender" }, { label: "ASR rules" }, { label: "JWT" }, { label: "Zod" }] },
  { title: "ERP & operations", items: [{ label: "SAP Business One" }, { label: "SAP HANA" }, { label: "SQL reporting" }, { label: "Hikvision" }, { label: "ZKTeco BioTime" }] },
];

const projectsUsing = (item: StackItem) => {
  const terms = (item.match ?? [item.label]).map((term) => term.toLowerCase());
  return projects.filter((project) =>
    [...project.technologies, project.role].some((entry) => terms.some((term) => entry.toLowerCase().includes(term))),
  );
};

const briefTypes = ["Website", "Web app or product", "E-commerce store", "Internal business system", "Infrastructure & security", "SAP Business One", "Something else"];

const categorySlug = (category: Category) => category.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
const categoryFromSlug = (slug: string | null) => projectCategories.find((category) => categorySlug(category) === slug) ?? "All";
const countIn = (category: Category) => (category === "All" ? projects.length : projects.filter((project) => project.category === category).length);

/** Let modified clicks (new tab, etc.) behave natively; handle plain clicks in-app. */
const isPlainClick = (event: MouseEvent) => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

function Arrow({ direction = "right" }: { direction?: "right" | "up-right" | "down" | "left" }) {
  const paths = { right: "M4 10h12m-5-5 5 5-5 5", "up-right": "M6 14 14 6m-7 0h7v7", down: "M10 4v12m-5-5 5 5 5-5", left: "M16 10H4m5-5-5 5 5 5" };
  return <svg className="icon-arrow" viewBox="0 0 20 20" aria-hidden="true"><path d={paths[direction]} /></svg>;
}

function OrbitMark() {
  return (
    <svg className="orbit-mark" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="8.5" />
      <ellipse cx="20" cy="20" rx="17" ry="6" transform="rotate(-24 20 20)" />
      <circle className="orbit-moon" cx="35" cy="13" r="2.2" />
    </svg>
  );
}

function CustomCursor() {
  return <div className="custom-cursor" aria-hidden="true"><i /><span>View</span></div>;
}

/** Section heading chrome: sector number, codename and a coordinate readout. */
function SectorLabel({ index, codename, children }: { index: string; codename: string; children: ReactNode }) {
  return (
    <div className="sector-label" data-reveal>
      <span className="sector-index">{index}</span>
      <span className="sector-codename">{codename}</span>
      <i aria-hidden="true" />
      <p>{children}</p>
    </div>
  );
}

function StatusPill({ project }: { project: Project }) {
  return <span className={`status-pill status-${project.statusKind}`}><i aria-hidden="true" />{project.status}</span>;
}

function CaseLink({ project, onOpen, className, children }: { project: Project; onOpen: (slug: string) => void; className?: string; children: ReactNode }) {
  return (
    <a className={className} href={`#case/${project.slug}`} onClick={(event) => { if (!isPlainClick(event)) return; event.preventDefault(); onOpen(project.slug); }}>
      {children}
    </a>
  );
}

function ProjectActions({ project, onOpen }: { project: Project; onOpen: (slug: string) => void }) {
  return (
    <div className="project-actions">
      {project.liveUrl && (
        <a className="action action-primary" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit live site<span className="sr-only">: {project.shortTitle} (opens in a new tab)</span> <Arrow direction="up-right" /></a>
      )}
      <CaseLink project={project} onOpen={onOpen} className={`action ${project.liveUrl ? "action-secondary" : "action-primary"}`}>
        Read the case study<span className="sr-only">: {project.shortTitle}</span> <Arrow />
      </CaseLink>
    </div>
  );
}

function CaseStudyDialog({ project, onClose, onOpen, onStartProject, onCopyLink }: {
  project: Project;
  onClose: () => void;
  onOpen: (slug: string) => void;
  onStartProject: () => void;
  onCopyLink: (slug: string) => void;
}) {
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useModal(dialogRef, onClose, closeRef);
  const position = projects.findIndex((item) => item.slug === project.slug);
  const previous = projects[(position - 1 + projects.length) % projects.length];
  const next = projects[(position + 1) % projects.length];

  useEffect(() => {
    dialogRef.current?.scrollTo({ top: 0 });
  }, [project.slug]);

  return (
    <div className="case-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <article className="case-drawer" role="dialog" aria-modal="true" aria-labelledby="case-title" ref={dialogRef} tabIndex={-1} data-lenis-prevent>
        <div className="case-drawer-head">
          <span>Case study · {project.index} / {String(projects.length).padStart(2, "0")}</span>
          <div>
            <button type="button" className="case-copy" onClick={() => onCopyLink(project.slug)}>Copy link</button>
            <button type="button" className="case-close" ref={closeRef} onClick={onClose} aria-label="Close case study">Close <i aria-hidden="true">×</i></button>
          </div>
        </div>
        <header className="case-drawer-title">
          <div><p>{project.projectType}</p><h2 id="case-title">{project.title}</h2></div>
          <StatusPill project={project} />
        </header>
        <ProjectVisual project={project} priority />
        <div className="case-drawer-body">
          <section><h3>Challenge</h3><p>{project.challenge}</p></section>
          <section><h3>Approach</h3><p>{project.approach}</p></section>
          <section className="case-role"><h3>My role</h3><p>{project.role}</p></section>
          <section className="case-solution"><h3>Solution</h3><p>{project.solution}</p></section>
          <section className="case-capabilities"><h3>System scope</h3><ul>{project.capabilities.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section className="case-technologies"><h3>Technologies & platforms</h3><ul>{project.technologies.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section className="case-status"><h3>Status</h3><p>{project.statusNote}</p></section>
        </div>
        {(project.liveUrl || project.relatedUrl) && (
          <div className="case-drawer-links">
            {project.liveUrl && <a className="action action-primary" href={project.liveUrl} target="_blank" rel="noopener noreferrer">Visit live site <Arrow direction="up-right" /></a>}
            {project.relatedUrl && <a className="action action-secondary" href={project.relatedUrl} target="_blank" rel="noopener noreferrer">{project.relatedUrlLabel ?? "View related public project"} <Arrow direction="up-right" /></a>}
          </div>
        )}
        <aside className="case-drawer-cta" aria-label="Start a similar project">
          <p>Planning something like <em>{project.shortTitle}</em>?</p>
          <div>
            <button type="button" className="button button-primary" onClick={onStartProject}>Start a project <span className="button-icon"><Arrow /></span></button>
            <a className="button button-ghost is-light" href={whatsappLink(`Hi Amin, I saw the ${project.shortTitle} case study and would like to talk about a project.`)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          </div>
        </aside>
        <nav className="case-drawer-pager" aria-label="More case studies">
          <button type="button" onClick={() => onOpen(previous.slug)}><Arrow direction="left" /><span><small>Previous</small>{previous.shortTitle}</span></button>
          <button type="button" onClick={() => onOpen(next.slug)}><span><small>Next</small>{next.shortTitle}</span><Arrow /></button>
        </nav>
      </article>
    </div>
  );
}

function SiteHeader({ view, menuOpen, scrolled, activeSection, modKey, onMenu, onCloseMenu, onHome, onWork, onSection, onPalette }: {
  view: View;
  menuOpen: boolean;
  scrolled: boolean;
  activeSection: string | null;
  modKey: string;
  onMenu: () => void;
  onCloseMenu: () => void;
  onHome: () => void;
  onWork: () => void;
  onSection: (id: SectionId) => void;
  onPalette: () => void;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // The open mobile menu behaves like a modal: Escape closes, focus stays in the header.
  useEffect(() => {
    if (!menuOpen) return;
    const header = headerRef.current;
    setScrollLock(true);
    header?.querySelector<HTMLElement>("#primary-nav a")?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseMenu();
        menuButtonRef.current?.focus();
      }
      if (event.key !== "Tab" || !header) return;
      const focusable = Array.from(header.querySelectorAll<HTMLElement>("a[href], button")).filter((element) => element.offsetParent !== null);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const desktop = window.matchMedia("(min-width: 901px)");
    const onDesktop = () => desktop.matches && onCloseMenu();
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      setScrollLock(false);
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [menuOpen, onCloseMenu]);

  return (
    <header className={`site-header${scrolled || view === "work" ? " is-scrolled" : ""}${menuOpen ? " menu-open" : ""}`} ref={headerRef}>
      <a className="wordmark" href="/" aria-label="Amin — home" onClick={(event) => { if (!isPlainClick(event)) return; event.preventDefault(); onHome(); }}>
        <OrbitMark />
        <span className="wordmark-text" aria-hidden="true"><b>Amin</b><small>Design · Code · Systems</small></span>
      </a>
      <nav id="primary-nav" className={menuOpen ? "is-open" : ""} aria-label="Primary">
        <ul>
          {navItems.map((item, index) => {
            const isWork = item.id === "all-work";
            const current = isWork ? view === "work" : view === "home" && activeSection === item.id;
            return (
              <li key={item.id}>
                <a
                  href={isWork ? "/work" : `/#${item.id}`}
                  className={current ? "is-current" : undefined}
                  aria-current={isWork && view === "work" ? "page" : undefined}
                  onClick={(event) => {
                    if (!isPlainClick(event)) return;
                    event.preventDefault();
                    if (isWork) onWork();
                    else onSection(item.id as SectionId);
                  }}
                >
                  <small aria-hidden="true">0{index + 1}</small>{item.label}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="nav-extra">
          <a className="button button-primary" href="/#contact" onClick={(event) => { if (!isPlainClick(event)) return; event.preventDefault(); onSection("contact"); }}>Start a project <span className="button-icon"><Arrow /></span></a>
          <div>
            <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp {contact.phoneDisplay}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
        </div>
      </nav>
      <div className="header-actions">
        <button type="button" className="palette-trigger" onClick={onPalette} aria-label="Jump to… (command palette)" aria-keyshortcuts="Control+K Meta+K">
          <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg>
          <span>Jump to</span><kbd aria-hidden="true">{modKey}K</kbd>
        </button>
        <a className="button button-primary button-small header-cta" href="/#contact" data-magnetic onClick={(event) => { if (!isPlainClick(event)) return; event.preventDefault(); onSection("contact"); }}>Start a project</a>
        <button className="menu-button" type="button" ref={menuButtonRef} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="primary-nav" onClick={onMenu}><span /><span /></button>
      </div>
      <div className="scroll-progress" aria-hidden="true" />
    </header>
  );
}

function Hero({ dubaiTime, modKey, onSection, onWork, onPalette }: { dubaiTime: string; modKey: string; onSection: (id: SectionId) => void; onWork: () => void; onPalette: () => void }) {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title" data-scroll-fx="exit">
      <div className="hero-hud" aria-hidden="true">
        <span className="hud-corner is-tl" /><span className="hud-corner is-tr" /><span className="hud-corner is-bl" /><span className="hud-corner is-br" />
      </div>
      <div className="hero-meta">
        <span className="availability"><i aria-hidden="true" />Signal open · available for select projects</span>
        <span className="hero-coords">25.2048° N · 55.2708° E <b>·</b> Dubai <b>·</b> <time>{dubaiTime || "GMT+4"}</time> GST</span>
      </div>
      <div className="hero-content">
        <h1 className="hero-title" id="hero-title">
          <span className="hero-title-kicker">Amin — designer & full-stack developer in Dubai</span>{" "}
          <span className="hero-line"><span>I design the interface.</span></span>{" "}
          <span className="hero-line"><em>I build what makes it work.</em></span>
        </h1>
        <p className="hero-lede">Websites and product interfaces, the apps and APIs behind them, and the infrastructure, security and SAP systems they run on — designed, engineered and launched as one connected system.</p>
        <div className="hero-ctas">
          <a className="button button-primary button-large" href="#contact" data-magnetic onClick={(event) => { if (!isPlainClick(event)) return; event.preventDefault(); onSection("contact"); }}>
            Start a project <span className="button-icon"><Arrow /></span>
          </a>
          <a className="button button-ghost button-large" href="/work" onClick={(event) => { if (!isPlainClick(event)) return; event.preventDefault(); onWork(); }}>Explore the work</a>
          <div className="hero-quick">
            <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp<span className="sr-only"> (opens in a new tab)</span></a>
            <a href={`mailto:${contact.email}`}>Email</a>
          </div>
        </div>
        <button type="button" className="hero-hint" onClick={onPalette}>
          <span aria-hidden="true">&gt;_</span> Press <kbd>{modKey}</kbd><kbd>K</kbd> to jump anywhere
        </button>
      </div>
      <ul className="hero-proof" aria-label="At a glance">
        <li><strong>{projects.length}</strong><span>Missions across web, product and systems</span></li>
        <li><strong>{String(liveProjects.length).padStart(2, "0")}</strong><span>Live public websites in orbit</span></li>
        <li><strong>EN / AR</strong><span>Bilingual, right-to-left aware interfaces</span></li>
        <li><strong>6</strong><span>Layers, from pixel to production server</span></li>
      </ul>
      <a className="scroll-cue" href="#about" aria-label="Scroll to About" onClick={(event) => { if (!isPlainClick(event)) return; event.preventDefault(); onSection("about"); }}>
        <span aria-hidden="true">Scroll to launch</span><i aria-hidden="true" />
      </a>
    </section>
  );
}

function AboutSection({ onContact, onWork }: { onContact: () => void; onWork: () => void }) {
  return (
    <section className="about section-shell" id="about" aria-labelledby="about-title" tabIndex={-1}>
      <SectorLabel index="01" codename="Orbit">About</SectorLabel>
      <div className="about-grid">
        <div className="about-copy" data-reveal>
          <h2 id="about-title">One developer across the whole stack — from the <em>first pixel</em> to the <em>production server.</em></h2>
          <p>I’m {owner.name}, a designer and full-stack developer based in Dubai. My work usually starts with visual direction and interface design, then continues through front-end and back-end development, launch, and the infrastructure it runs on.</p>
          <p>That range matters when a project involves commerce, bilingual Arabic / English journeys, internal workflows, integrations, security or SAP — not just a marketing page. You work with one accountable owner instead of a hand-off chain.</p>
          <dl className="about-facts">
            <div><dt>Base</dt><dd>Dubai, United Arab Emirates</dd></div>
            <div><dt>Practice</dt><dd>Web design · Full-stack · Systems</dd></div>
            <div><dt>Payload</dt><dd>Public websites, private platforms, production infrastructure</dd></div>
          </dl>
        </div>
        <div className="about-terminal" data-reveal>
          <WhoamiTerminal onContact={onContact} onWork={onWork} />
          <p className="terminal-caption">Mission console — try <code>help</code>, <code>stack</code> or <code>sudo hire amin</code>.</p>
        </div>
      </div>
    </section>
  );
}

function MissionCard({ project, index, onOpen }: { project: Project; index: number; onOpen: (slug: string) => void }) {
  return (
    <article className="mission" aria-labelledby={`mission-${project.slug}`}>
      <div className="mission-head">
        <span>Mission {String(index + 1).padStart(2, "0")}</span>
        <StatusPill project={project} />
      </div>
      <ProjectVisual project={project} />
      <div className="mission-copy">
        <p>{project.projectType}</p>
        <h3 id={`mission-${project.slug}`}>{project.shortTitle}</h3>
        <strong>{project.shortDescription}</strong>
        <ul className="tech-line" aria-label="Technologies">{project.technologies.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul>
        <ProjectActions project={project} onOpen={onOpen} />
      </div>
    </article>
  );
}

function WorkCard({ project, onOpen }: { project: Project; onOpen: (slug: string) => void }) {
  return (
    <article className="work-card" data-card-reveal>
      <ProjectVisual project={project} compact />
      <div className="work-card-copy">
        <p><span>{project.category}</span><span>{project.status}</span></p>
        <h3><CaseLink project={project} onOpen={onOpen} className="work-card-link">{project.shortTitle}<span className="sr-only"> — read the case study</span></CaseLink></h3>
        <strong>{project.shortDescription}</strong>
        <span className="work-card-more" aria-hidden="true">Case study <Arrow /></span>
      </div>
    </article>
  );
}

function SelectedWork({ onOpen, onWork }: { onOpen: (slug: string) => void; onWork: () => void }) {
  const others = projects.filter((project) => !featuredProjects.includes(project));
  return (
    <section className="work-section" id="work" aria-labelledby="work-title" tabIndex={-1}>
      <div className="section-shell">
        <SectorLabel index="02" codename="Missions">Selected work</SectorLabel>
        <div className="section-heading" data-reveal>
          <h2 id="work-title">Selected <em>missions.</em></h2>
          <p>Public interfaces are only one layer. These projects connect identity and interaction to product logic, data, operations and resilient infrastructure — each shown with its real public, private or production status.</p>
        </div>
      </div>
      <div className="reel" data-hscroll>
        <div className="reel-sticky">
          <div className="reel-track" data-hscroll-track>
            <div className="reel-intro" aria-hidden="true">
              <span>{String(featuredProjects.length).padStart(2, "0")} featured</span>
              <strong>Scroll <em>sideways</em> through the fleet.</strong>
              <i><Arrow /></i>
            </div>
            {featuredProjects.map((project, index) => <MissionCard project={project} index={index} onOpen={onOpen} key={project.slug} />)}
            <a className="reel-outro" href="/work" onClick={(event) => { if (!isPlainClick(event)) return; event.preventDefault(); onWork(); }}>
              <span>Full index</span>
              <strong>All {projects.length} projects</strong>
              <i aria-hidden="true"><Arrow /></i>
            </a>
          </div>
          <div className="reel-progress" aria-hidden="true"><i /></div>
        </div>
      </div>
      <div className="more-work section-shell">
        <div className="more-work-head" data-reveal><p>More from the index</p><span>{others.length} projects</span></div>
        <div className="work-cards">{others.map((project) => <WorkCard project={project} onOpen={onOpen} key={project.slug} />)}</div>
        <a className="all-work-cta" href="/work" data-reveal onClick={(event) => { if (!isPlainClick(event)) return; event.preventDefault(); onWork(); }}>
          <span>Products · systems · infrastructure · security · SAP</span>
          <strong>Explore all {projects.length} projects</strong>
          <i aria-hidden="true"><Arrow /></i>
        </a>
      </div>
    </section>
  );
}

function CtaBand({ onContact }: { onContact: () => void }) {
  return (
    <aside className="cta-band section-shell" aria-labelledby="cta-band-title" data-scroll-fx="through">
      <div className="cta-band-inner" data-reveal>
        <p className="cta-band-kicker"><i aria-hidden="true" />Incoming transmission</p>
        <h2 id="cta-band-title">Have a website, product or system that needs to <em>work properly?</em></h2>
        <div className="cta-band-actions">
          <a className="button button-primary button-large" href="#contact" data-magnetic onClick={(event) => { if (!isPlainClick(event)) return; event.preventDefault(); onContact(); }}>Start a project <span className="button-icon"><Arrow /></span></a>
          <a className="button button-ghost button-large" href={whatsappLink("Hi Amin, I'd like to talk about a project.")} target="_blank" rel="noopener noreferrer">Message on WhatsApp</a>
        </div>
      </div>
    </aside>
  );
}

function StackExplorer({ onOpen }: { onOpen: (slug: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedItem = stackGroups.flatMap((group) => group.items).find((item) => item.label === selected);
  const used = selectedItem ? projectsUsing(selectedItem) : [];
  return (
    <div className="stack-explorer">
      <div className="stack-groups">
        {stackGroups.map((group) => (
          <div className="stack-group" key={group.title} data-reveal>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item.label}>
                  <button type="button" aria-pressed={selected === item.label} className={selected === item.label ? "is-active" : undefined} onClick={() => setSelected((current) => (current === item.label ? null : item.label))}>
                    {item.label}<small>{projectsUsing(item).length}</small>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="stack-result" aria-live="polite">
        {selectedItem ? (
          <>
            <p><b>{selectedItem.label}</b> appears in {used.length} {used.length === 1 ? "project" : "projects"}:</p>
            <ul>{used.map((project) => <li key={project.slug}><CaseLink project={project} onOpen={onOpen}>{project.shortTitle} <Arrow /></CaseLink></li>)}</ul>
          </>
        ) : (
          <p>Select any tool to see the projects that use it.</p>
        )}
      </div>
    </div>
  );
}

// A fixed, illustrative price series; the indicators below are really computed from it.
const tradingCloses = [100, 102, 101, 104, 103, 106, 108, 107, 110, 109, 112, 111, 113, 116, 115, 118, 117, 115, 116, 119, 121, 120, 123, 122, 125, 124, 127, 129, 128, 131];

function TradingStudy() {
  const modes = ["RSI", "Trend", "Momentum"] as const;
  const [mode, setMode] = useState<(typeof modes)[number]>("Trend");
  const chart = useMemo(() => {
    const low = Math.min(...tradingCloses) - 3;
    const high = Math.max(...tradingCloses) + 3;
    const x = (index: number) => 8 + index * (284 / (tradingCloses.length - 1));
    const y = (value: number) => 112 - ((value - low) / (high - low)) * 104;
    const candles = tradingCloses.map((close, index) => {
      const open = index ? tradingCloses[index - 1] : close - 1;
      return { x: x(index), open: y(open), close: y(close), high: y(Math.max(open, close) + 1.2), low: y(Math.min(open, close) - 1.2), up: close >= open };
    });
    // Least-squares trend line.
    const n = tradingCloses.length;
    const meanX = (n - 1) / 2;
    const meanY = tradingCloses.reduce((sum, value) => sum + value, 0) / n;
    const slope = tradingCloses.reduce((sum, value, index) => sum + (index - meanX) * (value - meanY), 0) / tradingCloses.reduce((sum, _, index) => sum + (index - meanX) ** 2, 0);
    const trend = [0, n - 1].map((index) => `${x(index)},${y(meanY + slope * (index - meanX))}`).join(" ");
    // RSI over a short window.
    const period = 6;
    const rsi = tradingCloses.map((_, index) => {
      if (index < period) return null;
      let gains = 0;
      let losses = 0;
      for (let step = index - period + 1; step <= index; step += 1) {
        const change = tradingCloses[step] - tradingCloses[step - 1];
        if (change > 0) gains += change; else losses -= change;
      }
      return losses === 0 ? 100 : 100 - 100 / (1 + gains / losses);
    });
    const rsiLine = rsi.map((value, index) => (value === null ? null : `${x(index)},${38 - (value / 100) * 34}`)).filter(Boolean).join(" ");
    const momentum = tradingCloses.map((value, index) => (index < 4 ? 0 : value - tradingCloses[index - 4]));
    return { candles, trend, rsiLine, momentum, x, lastRsi: rsi[rsi.length - 1] ?? 50 };
  }, []);

  const reading = mode === "RSI"
    ? `RSI ${Math.round(chart.lastRsi)} — ${chart.lastRsi > 70 ? "overbought zone" : chart.lastRsi < 30 ? "oversold zone" : "neutral"}`
    : mode === "Trend" ? "Trend — rising regression slope" : `Momentum ${chart.momentum[chart.momentum.length - 1] > 0 ? "positive" : "negative"} over 4 bars`;

  return (
    <div className="trading-study">
      <svg className="trading-chart" viewBox="0 0 300 160" aria-hidden="true">
        <g className="trading-grid">{[20, 50, 80, 110].map((y) => <line x1="0" x2="300" y1={y} y2={y} key={y} />)}</g>
        {chart.candles.map((candle) => (
          <g className={candle.up ? "candle is-up" : "candle"} key={candle.x}>
            <line x1={candle.x} x2={candle.x} y1={candle.high} y2={candle.low} />
            <rect x={candle.x - 2.6} width="5.2" y={Math.min(candle.open, candle.close)} height={Math.max(Math.abs(candle.close - candle.open), 1)} />
          </g>
        ))}
        {mode === "Trend" && <polyline className="trading-trend" points={chart.trend} />}
        <g transform="translate(0 118)">
          {mode === "RSI" && <><line className="trading-band" x1="0" x2="300" y1={38 - 0.7 * 34} y2={38 - 0.7 * 34} /><line className="trading-band" x1="0" x2="300" y1={38 - 0.3 * 34} y2={38 - 0.3 * 34} /><polyline className="trading-rsi" points={chart.rsiLine} /></>}
          {mode === "Momentum" && chart.momentum.map((value, index) => <rect className={value >= 0 ? "trading-mom is-up" : "trading-mom"} x={chart.x(index) - 2.4} width="4.8" y={value >= 0 ? 21 - value * 2.4 : 21} height={Math.max(Math.abs(value) * 2.4, 0.5)} key={index} />)}
          {mode === "Trend" && <text x="4" y="24">assistant: trend · rsi · momentum on live ticks</text>}
        </g>
      </svg>
      <div className="trading-controls" role="group" aria-label="Indicator overlay">
        {modes.map((item) => <button type="button" key={item} aria-pressed={mode === item} className={mode === item ? "is-active" : undefined} onClick={() => setMode(item)}>{item}</button>)}
      </div>
      <p className="trading-reading" aria-live="polite">{reading}<small>Illustrative data</small></p>
    </div>
  );
}

function ProjectBrief() {
  const [type, setType] = useState(briefTypes[0]);
  const [details, setDetails] = useState("");
  const message = `Hi Amin, I'd like to talk about a project.\n\nType: ${type}${details.trim() ? `\nDetails: ${details.trim()}` : ""}`;
  return (
    <form className="brief" onSubmit={(event) => event.preventDefault()} aria-labelledby="brief-title">
      <p className="brief-title" id="brief-title">Project brief <span>· 20 seconds</span></p>
      <fieldset>
        <legend>What are you planning?</legend>
        <div className="brief-options">
          {briefTypes.map((item) => (
            <label key={item} className={type === item ? "is-checked" : undefined}>
              <input type="radio" name="brief-type" value={item} checked={type === item} onChange={() => setType(item)} />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="brief-details" htmlFor="brief-details">A line or two about it <span>(optional)</span></label>
      <textarea id="brief-details" rows={3} maxLength={600} value={details} onChange={(event) => setDetails(event.target.value)} placeholder="Goals, timeline, links to anything that already exists…" data-lenis-prevent />
      <div className="brief-actions">
        <a className="button button-primary button-large" href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" data-magnetic>Send on WhatsApp <span className="button-icon"><Arrow direction="up-right" /></span></a>
        <a className="button button-ghost button-large" href={mailtoLink(`Project enquiry — ${type}`, message)}>Send by email</a>
      </div>
      <p className="brief-note">Opens WhatsApp or your email app with the message ready to send. Nothing is stored on this site.</p>
    </form>
  );
}

function CapabilitiesSection({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <section className="capabilities section-shell" id="stack" aria-labelledby="stack-title" tabIndex={-1}>
      <SectorLabel index="03" codename="Systems">Capabilities &amp; stack</SectorLabel>
      <div className="section-heading" data-reveal>
        <h2 id="stack-title">Design, code and <em>the systems underneath.</em></h2>
        <p>Six capabilities, demonstrated in the work above — and the tools behind them, linked to the projects where they were used.</p>
      </div>
      <ol className="capability-list">
        {capabilities.map(([number, title, description]) => (
          <li className="capability" data-card-reveal key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></li>
        ))}
      </ol>
      <StackExplorer onOpen={onOpen} />
    </section>
  );
}

function ProcessSection() {
  return (
    <section className="process section-shell" id="process" aria-labelledby="process-title" data-line-draw tabIndex={-1}>
      <SectorLabel index="04" codename="Trajectory">Process</SectorLabel>
      <div className="section-heading" data-reveal>
        <h2 id="process-title">A flight plan from <em>idea to orbit.</em></h2>
        <p>Every project moves through the same five stages, so design decisions survive the build and the build survives launch.</p>
      </div>
      <div className="process-track">
        <svg className="process-connector" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
          <path className="process-orbit-ghost" d="M 10 100 C 250 -10, 750 -10, 990 100" />
          <path className="process-orbit" d="M 10 100 C 250 -10, 750 -10, 990 100" pathLength="1" />
        </svg>
        <ol className="process-grid">
          {processSteps.map(([number, title, description, detail]) => (
            <li className="process-card" data-card-reveal key={number}>
              <span>T-{number}</span><i aria-hidden="true" /><h3>{title}</h3><p>{description}</p><small>{detail}</small>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function LabSection() {
  const experiment = labExperiments[0];
  return (
    <section className="lab section-shell" id="lab" aria-labelledby="lab-title" tabIndex={-1}>
      <SectorLabel index="05" codename="Lab">Lab / experiments</SectorLabel>
      <div className="section-heading" data-reveal>
        <h2 id="lab-title">Experiments in <em>real time.</em></h2>
        <p>A test bench for interaction, data visualisation and live interfaces — the details that turn layouts into products.</p>
      </div>
      <article className="lab-card" data-reveal aria-labelledby="lab-trading">
        <div className="lab-card-copy">
          <span>Experiment 01</span>
          <h3 id="lab-trading">{experiment.title}</h3>
          <p>{experiment.summary}</p>
          <ul className="lab-tags">{experiment.technologies.map((item) => <li key={item}>{item}</li>)}</ul>
          <small>{experiment.note}</small>
        </div>
        <TradingStudy />
      </article>
    </section>
  );
}

function ContactSection({ dubaiTime, onCopyEmail }: { dubaiTime: string; onCopyEmail: () => void }) {
  return (
    <section className="contact section-shell" id="contact" aria-labelledby="contact-title" tabIndex={-1}>
      <SectorLabel index="06" codename="Transmission">Contact</SectorLabel>
      <div className="contact-grid">
        <div className="contact-lead">
          <p className="availability"><i aria-hidden="true" />Signal open · available for select projects</p>
          <h2 id="contact-title">Let’s launch something <em>that works.</em></h2>
          <p>Tell me what you’re planning — a website, a product, an internal system or the infrastructure underneath it. I’ll reply with honest next steps.</p>
          <ul className="contact-channels">
            <li>
              <span>Email</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <button type="button" onClick={onCopyEmail}>Copy<span className="sr-only"> email address</span></button>
            </li>
            <li>
              <span>WhatsApp</span>
              <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer">{contact.phoneDisplay}</a>
              <a href={`tel:${contact.phoneE164}`}>Call<span className="sr-only"> {contact.phoneDisplay}</span></a>
            </li>
            <li>
              <span>Base</span>
              <p>Dubai, UAE · <time>{dubaiTime || "GMT+4"}</time> local time</p>
            </li>
          </ul>
        </div>
        <ProjectBrief />
      </div>
    </section>
  );
}

function SiteFooter({ modKey, onHome, onWork, onSection, onPalette }: { modKey: string; onHome: () => void; onWork: () => void; onSection: (id: SectionId) => void; onPalette: () => void }) {
  const links: Array<[SectionId | "all-work", string]> = [["all-work", "All work"], ["about", "About"], ["stack", "Stack"], ["process", "Process"], ["lab", "Lab"], ["contact", "Contact"]];
  return (
    <footer className="site-footer section-shell">
      <div className="footer-top">
        <a className="footer-mark" href="/" onClick={(event) => { if (!isPlainClick(event)) return; event.preventDefault(); onHome(); }}>Amin<span aria-hidden="true">.</span></a>
        <p>Designer & full-stack developer in Dubai, UAE — websites, products, enterprise systems and the infrastructure underneath.</p>
      </div>
      <div className="footer-cols">
        <nav aria-label="Footer">
          <ul>
            {links.map(([id, label]) => (
              <li key={id}>
                <a href={id === "all-work" ? "/work" : `/#${id}`} onClick={(event) => { if (!isPlainClick(event)) return; event.preventDefault(); if (id === "all-work") onWork(); else onSection(id); }}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="footer-contact">
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
          <a href={contact.whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp · {contact.phoneDisplay}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© <span suppressHydrationWarning>{new Date().getFullYear()}</span> Amin · Dubai, UAE · Rendered in WebGL</span>
        <button type="button" onClick={onPalette}><kbd>{modKey}K</kbd> Command palette</button>
        <a href="#top" onClick={(event) => { if (!isPlainClick(event)) return; event.preventDefault(); scrollToTarget("top"); }}>Return to launch <Arrow direction="up-right" /></a>
      </div>
    </footer>
  );
}

function HomeView({ dubaiTime, modKey, onOpen, onWork, onSection, onPalette, onCopyEmail }: {
  dubaiTime: string;
  modKey: string;
  onOpen: (slug: string) => void;
  onWork: () => void;
  onSection: (id: SectionId) => void;
  onPalette: () => void;
  onCopyEmail: () => void;
}) {
  return (
    <>
      <Hero dubaiTime={dubaiTime} modKey={modKey} onSection={onSection} onWork={onWork} onPalette={onPalette} />
      <div className="discipline-rail" aria-hidden="true" data-velocity-marquee>
        <div className="discipline-track">{[0, 1].map((group) => <div className="discipline-group" key={group}>{disciplines.map((item) => <span key={item}>{item}<i>✦</i></span>)}</div>)}</div>
      </div>
      <AboutSection onContact={() => onSection("contact")} onWork={onWork} />
      <SelectedWork onOpen={onOpen} onWork={onWork} />
      <CtaBand onContact={() => onSection("contact")} />
      <CapabilitiesSection onOpen={onOpen} />
      <ProcessSection />
      <LabSection />
      <ContactSection dubaiTime={dubaiTime} onCopyEmail={onCopyEmail} />
    </>
  );
}

function WorkView({ category, listKey, dubaiTime, onCategory, onOpen, onCopyEmail }: {
  category: Category;
  listKey: number;
  dubaiTime: string;
  onCategory: (category: Category) => void;
  onOpen: (slug: string) => void;
  onCopyEmail: () => void;
}) {
  const visibleProjects = category === "All" ? projects : projects.filter((project) => project.category === category);
  const privateCount = projects.filter((project) => !project.liveUrl).length;
  return (
    <>
      <section className="work-page-hero section-shell" id="top" aria-labelledby="work-page-title" data-scroll-fx="exit">
        <SectorLabel index="Index" codename="Mission log">Web experiences · Products · Private systems</SectorLabel>
        <div className="work-page-title">
          <h1 id="work-page-title">The work,<br /><em>in full.</em></h1>
          <div>
            <p>Every website, product interface and deeper systems project — from bilingual commerce to SAP, infrastructure and cybersecurity — each presented with its real public, private or production status.</p>
            <ul className="work-stats" aria-label="Index summary">
              <li><strong>{projects.length}</strong>projects</li>
              <li><strong>{String(liveProjects.length).padStart(2, "0")}</strong>live public sites</li>
              <li><strong>{privateCount}</strong>private, internal or case-study builds</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="work-index section-shell" id="project-index" aria-labelledby="index-title">
        <div className="work-toolbar">
          <h2 id="index-title">Project index</h2>
          <div className="work-filters" role="group" aria-label="Filter projects by category">
            {projectCategories.map((item) => (
              <button type="button" key={item} className={category === item ? "is-active" : ""} aria-pressed={category === item} onClick={() => onCategory(item)}>
                {item}<span aria-hidden="true">{countIn(item)}</span><span className="sr-only"> ({countIn(item)} projects)</span>
              </button>
            ))}
          </div>
        </div>
        <p className="sr-only" aria-live="polite">{`Showing ${visibleProjects.length} ${category === "All" ? "" : `${category} `}projects`}</p>
        <ol className={`work-list${listKey ? " is-refiltered" : ""}`} key={listKey}>
          {visibleProjects.map((project, index) => (
            <li className="work-row" key={project.slug} style={{ viewTransitionName: `work-${project.slug}`, "--i": index } as CSSProperties}>
              <article aria-labelledby={`row-${project.slug}`}>
                <div className="work-row-index" aria-hidden="true">{project.index}</div>
                <div className="work-row-visual"><ProjectVisual project={project} compact /></div>
                <div className="work-row-copy">
                  <p>{project.projectType}</p>
                  <h3 id={`row-${project.slug}`}>{project.shortTitle}</h3>
                  <strong>{project.shortDescription}</strong>
                  <small><b>Role</b>{project.role}</small>
                  <ul className="tech-line" aria-label="Technologies">{project.technologies.slice(0, 6).map((item) => <li key={item}>{item}</li>)}</ul>
                </div>
                <div className="work-row-side"><StatusPill project={project} /><ProjectActions project={project} onOpen={onOpen} /></div>
              </article>
            </li>
          ))}
        </ol>
      </section>
      <section className="lab-index section-shell" id="lab-index" aria-labelledby="lab-index-title">
        <h2 id="lab-index-title">From the lab</h2>
        <ul>
          {labExperiments.map((experiment) => (
            <li key={experiment.slug}>
              <h3>{experiment.title}</h3>
              <p>{experiment.summary}</p>
              <small>{experiment.technologies.join(" · ")} — {experiment.note}</small>
            </li>
          ))}
        </ul>
      </section>
      <ContactSection dubaiTime={dubaiTime} onCopyEmail={onCopyEmail} />
    </>
  );
}

/** Scroll to a section and move keyboard focus there without a second jump. */
const focusSection = (id: string) => {
  scrollToTarget(id);
  document.getElementById(id)?.focus({ preventScroll: true });
};

// The shortcut label is a client-only fact; the server (and hydration) render "⌘".
const subscribeNever = () => () => undefined;
const clientModKey = () => {
  const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform || navigator.platform;
  return /mac|iphone|ipad/i.test(platform) ? "⌘" : "Ctrl ";
};

const readCaseSlug = () => {
  const match = window.location.hash.match(/^#case\/([a-z0-9-]+)$/);
  return match && getProject(match[1]) ? match[1] : null;
};

export default function Home({ initialView = "home" }: { initialView?: View }) {
  const [view, setView] = useState<View>(initialView);
  const [category, setCategory] = useState<Category>("All");
  const [listKey, setListKey] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dubaiTime, setDubaiTime] = useState("");
  const modKey = useSyncExternalStore(subscribeNever, clientModKey, () => "⌘");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const pendingSection = useRef<string | null>(null);
  const toastTimer = useRef(0);
  const selectedProject = selectedSlug ? getProject(selectedSlug) ?? null : null;

  useMotionSystem({ motionKey: `${view}:${category}:${listKey}`, onScrolledChange: setScrolled });

  const notify = useCallback((message: string) => {
    setToast(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  }, []);

  // Route, filter and case-study state all live in the URL.
  useEffect(() => {
    const syncFromUrl = () => {
      setView(window.location.pathname.replace(/\/+$/, "") === "/work" ? "work" : "home");
      setCategory(categoryFromSlug(new URLSearchParams(window.location.search).get("filter")));
      setSelectedSlug(readCaseSlug());
    };
    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    window.addEventListener("hashchange", syncFromUrl);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
      window.removeEventListener("hashchange", syncFromUrl);
    };
  }, []);

  useEffect(() => {
    const updateClock = () => setDubaiTime(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()));
    updateClock();
    const clock = window.setInterval(updateClock, 30000);
    return () => window.clearInterval(clock);
  }, []);

  useEffect(() => {
    document.title = routeSeo[view].title;
    if (pendingSection.current) {
      const target = pendingSection.current;
      pendingSection.current = null;
      window.requestAnimationFrame(() => focusSection(target));
    }
  }, [view]);

  // Highlight the nav item for the section being read.
  useEffect(() => {
    if (view !== "home") return;
    const sections = ["about", "work", "stack", "process", "lab", "contact"].map((id) => document.getElementById(id)).filter((element): element is HTMLElement => Boolean(element));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [view]);

  // ⌘K / Ctrl+K toggles the command palette from anywhere.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setMenuOpen(false);
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navigate = useCallback((next: View, section?: string) => {
    setMenuOpen(false);
    setSelectedSlug(null);
    const target = section ? `/#${section}` : next === "work" ? "/work" : "/";
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== target) window.history.pushState({}, "", target);
    if (next === "work") setCategory("All");
    if (next === view) {
      if (section) focusSection(section);
      else scrollToTarget("top");
      return;
    }
    pendingSection.current = section ?? null;
    setView(next);
    if (!section) scrollToTarget("top", { immediate: true });
  }, [view]);

  const goToSection = useCallback((id: SectionId) => {
    setMenuOpen(false);
    if (view === "home") {
      window.history.replaceState({}, "", `/#${id}`);
      focusSection(id);
    } else {
      navigate("home", id);
    }
  }, [navigate, view]);

  const openCaseStudy = useCallback((slug: string) => {
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}#case/${slug}`);
    setSelectedSlug(slug);
  }, []);

  const closeCaseStudy = useCallback(() => {
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}`);
    setSelectedSlug(null);
  }, []);

  const changeCategory = useCallback((next: Category) => {
    const url = new URL(window.location.href);
    if (next === "All") url.searchParams.delete("filter"); else url.searchParams.set("filter", categorySlug(next));
    window.history.replaceState(window.history.state, "", url);
    const doc = document as Document & { startViewTransition?: (update: () => void) => unknown };
    if (doc.startViewTransition && !prefersReducedMotion()) {
      doc.startViewTransition(() => flushSync(() => setCategory(next)));
    } else {
      setCategory(next);
      if (!prefersReducedMotion()) setListKey((key) => key + 1);
    }
  }, []);

  const copyEmail = useCallback(() => {
    if (!navigator.clipboard) {
      window.location.href = `mailto:${contact.email}`;
      return;
    }
    navigator.clipboard.writeText(contact.email)
      .then(() => notify(`Copied ${contact.email}`))
      .catch(() => { window.location.href = `mailto:${contact.email}`; });
  }, [notify]);

  const copyCaseLink = useCallback((slug: string) => {
    const url = `${window.location.origin}${window.location.pathname}#case/${slug}`;
    if (!navigator.clipboard) {
      notify(url);
      return;
    }
    navigator.clipboard.writeText(url).then(() => notify("Case study link copied")).catch(() => notify(url));
  }, [notify]);

  const commands = useMemo<Command[]>(() => [
    { id: "start", group: "Actions", label: "Start a project", hint: "Project brief", keywords: "hire contact brief quote", run: () => goToSection("contact") },
    { id: "copy-email", group: "Actions", label: "Copy email address", hint: contact.email, keywords: "mail clipboard", run: copyEmail },
    { id: "email", group: "Actions", label: "Send an email", hint: contact.email, keywords: "mail write", run: () => { window.location.href = `mailto:${contact.email}`; } },
    { id: "whatsapp", group: "Actions", label: "Open WhatsApp chat", hint: contact.phoneDisplay, keywords: "phone message chat call", run: () => { window.open(contact.whatsappUrl, "_blank", "noopener,noreferrer"); } },
    { id: "home", group: "Navigate", label: "Home", keywords: "top hero start", run: () => navigate("home") },
    { id: "all-work", group: "Navigate", label: "All work — project index", keywords: "portfolio projects list", run: () => navigate("work") },
    { id: "about", group: "Navigate", label: "About", keywords: "who whoami terminal", run: () => goToSection("about") },
    { id: "selected", group: "Navigate", label: "Selected work", keywords: "featured case studies", run: () => goToSection("work") },
    { id: "stack", group: "Navigate", label: "Capabilities & stack", keywords: "skills tools technologies", run: () => goToSection("stack") },
    { id: "process", group: "Navigate", label: "Process", keywords: "how approach steps", run: () => goToSection("process") },
    { id: "lab", group: "Navigate", label: "Lab experiments", keywords: "studies playground", run: () => goToSection("lab") },
    { id: "contact", group: "Navigate", label: "Contact", keywords: "email whatsapp phone", run: () => goToSection("contact") },
    ...projects.map((project): Command => ({
      id: `case-${project.slug}`,
      group: "Case studies",
      label: project.title,
      hint: project.category,
      keywords: `${project.technologies.join(" ")} ${project.projectType}`,
      run: () => openCaseStudy(project.slug),
    })),
    ...projectCategories.filter((item) => item !== "All").map((item): Command => ({
      id: `filter-${categorySlug(item)}`,
      group: "Filter work",
      label: `Show ${item} projects`,
      hint: `${countIn(item)} projects`,
      run: () => { navigate("work"); changeCategory(item); },
    })),
    ...labExperiments.map((experiment): Command => ({
      id: `lab-${experiment.slug}`,
      group: "Lab",
      label: experiment.title,
      hint: "Experiment",
      keywords: experiment.technologies.join(" "),
      run: () => goToSection("lab"),
    })),
  ], [changeCategory, copyEmail, goToSection, navigate, openCaseStudy]);

  const openPalette = useCallback(() => { setMenuOpen(false); setPaletteOpen(true); }, []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <div id={SITE_CONTENT_ID} className="site">
        <a className="skip-link" href="#main">Skip to content</a>
        <SpaceCanvas view={view} />
        <FlightHud />
        <CustomCursor />
        <SiteHeader
          view={view}
          menuOpen={menuOpen}
          scrolled={scrolled}
          activeSection={activeSection}
          modKey={modKey}
          onMenu={() => setMenuOpen((open) => !open)}
          onCloseMenu={closeMenu}
          onHome={() => navigate("home")}
          onWork={() => navigate("work")}
          onSection={goToSection}
          onPalette={openPalette}
        />
        <main id="main" className={view === "work" ? "is-work" : "is-home"} tabIndex={-1}>
          {view === "home"
            ? <HomeView dubaiTime={dubaiTime} modKey={modKey} onOpen={openCaseStudy} onWork={() => navigate("work")} onSection={goToSection} onPalette={openPalette} onCopyEmail={copyEmail} />
            : <WorkView category={category} listKey={listKey} dubaiTime={dubaiTime} onCategory={changeCategory} onOpen={openCaseStudy} onCopyEmail={copyEmail} />}
        </main>
        <SiteFooter modKey={modKey} onHome={() => navigate("home")} onWork={() => navigate("work")} onSection={goToSection} onPalette={openPalette} />
      </div>
      {selectedProject && (
        <CaseStudyDialog
          project={selectedProject}
          onClose={closeCaseStudy}
          onOpen={openCaseStudy}
          onCopyLink={copyCaseLink}
          onStartProject={() => { closeCaseStudy(); window.requestAnimationFrame(() => goToSection("contact")); }}
        />
      )}
      {paletteOpen && <CommandPalette commands={commands} onClose={closePalette} />}
      <div className={`toast${toast ? " is-visible" : ""}`} role="status" aria-live="polite">{toast}</div>
    </>
  );
}
