"use client";

import { useEffect, useState } from "react";
import {
  featuredProjects,
  projectCategories,
  projects,
  type Project,
  type ProjectCategory,
} from "./project-data";

type View = "home" | "work";

const capabilities = [
  ["01", "Software & product engineering", "Mobile products, web platforms and operational applications shaped around real business workflows."],
  ["02", "Enterprise systems & ERP", "Business systems, SAP / HANA, reporting and process improvements across operational teams."],
  ["03", "Infrastructure & resilience", "Virtualization, identity, networks, backup and disaster recovery designed as one operating environment."],
  ["04", "Cybersecurity hardening", "Layered identity, endpoint, policy and audit controls introduced through staged enterprise deployment."],
  ["05", "Commerce & automation", "Customer journeys, payments, accounts, delivery, integrations and administration across mobile and web."],
  ["06", "Digital transformation", "Connecting product, process and technology decisions into systems that businesses can actually operate."],
];

const publicSurfaceProjects = [
  "alrawdah-public-commerce-website",
  "sahaba-water",
  "haak-solutions",
].map((slug) => projects.find((project) => project.slug === slug)).filter((project): project is Project => Boolean(project?.liveUrl && project.coverAsset));

function CosmosStage() {
  return (
    <div className="cosmos-stage" aria-hidden="true">
      <div className="stars stars-near" />
      <div className="stars stars-far" />
      <div className="nebula nebula-pink" />
      <div className="nebula nebula-blue" />
      <div className="distant-planet"><i /><span /></div>
      <div className="shooting-star shooting-star-one" />
      <div className="shooting-star shooting-star-two" />
    </div>
  );
}

function HeroProjectShowcase() {
  return (
    <div className="hero-showcase" aria-label="Selected live product previews">
      <div className="showcase-field" aria-hidden="true"><i /><i /><i /></div>
      {publicSurfaceProjects.map((project, index) => (
        <a
          className={`hero-shot hero-shot-${index + 1}`}
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${project.shortTitle} live project`}
          key={project.slug}
        >
          <span className="hero-shot-bar"><i /><b>{project.shortTitle}</b><em>LIVE ↗</em></span>
          <img src={project.coverAsset} alt="" />
        </a>
      ))}
      <div className="showcase-caption"><span>REAL PRODUCT SURFACES</span><b>03 / LIVE</b></div>
    </div>
  );
}

function StatusPill({ project }: { project: Project }) {
  return <span className={`status-pill status-${project.statusKind}`}><i />{project.status}</span>;
}

function ProjectVisual({ project, compact = false }: { project: Project; compact?: boolean }) {
  if (project.coverAsset) {
    return (
      <div className={`project-cover browser-cover ${compact ? "is-compact" : ""}`}>
        <div className="browser-bar">
          <span><i /><i /><i /></span>
          <small>{project.liveUrl?.replace("https://", "").replace(/\/$/, "")}</small>
          <b>{project.liveUrl ? "PUBLIC" : "CASE STUDY"}</b>
        </div>
        <img src={project.coverAsset} alt={project.coverAlt ?? ""} />
        <div className="cover-glow" />
      </div>
    );
  }

  if (project.visual === "commerce") {
    return (
      <div className={`project-cover system-cover commerce-cover ${compact ? "is-compact" : ""}`} aria-label="Commerce platform architecture illustration">
        <div className="cover-label"><span>PRODUCT ECOSYSTEM</span><b>PRIVATE / PRODUCTION</b></div>
        <div className="phone-stack" aria-hidden="true">
          <div className="phone phone-back"><small>ANDROID</small><i /><i /><i /></div>
          <div className="phone phone-front"><small>iOS</small><strong>ORDER</strong><span>Wallet · Coupon</span><b>Track delivery</b></div>
        </div>
        <div className="commerce-core" aria-hidden="true">
          <span>ADMIN</span><i />
          <strong>API</strong><i />
          <span>POSTGRESQL</span>
        </div>
        <div className="integration-rail" aria-hidden="true"><span>PAYMENTS</span><span>IDENTITY</span><span>SAP / FUTURE</span></div>
      </div>
    );
  }

  if (project.visual === "infrastructure") {
    return (
      <div className={`project-cover system-cover infrastructure-cover ${compact ? "is-compact" : ""}`} aria-label="Enterprise infrastructure topology illustration">
        <div className="cover-label"><span>ENTERPRISE TOPOLOGY</span><b>PRODUCTION ENVIRONMENT</b></div>
        <div className="topology-lines" aria-hidden="true" />
        <div className="topology-node node-core"><small>VIRTUALIZATION</small><strong>PROXMOX</strong></div>
        <div className="topology-node node-identity"><small>IDENTITY</small><strong>AD · DNS</strong></div>
        <div className="topology-node node-sap"><small>BUSINESS</small><strong>SAP HANA</strong></div>
        <div className="topology-node node-security"><small>EDGE</small><strong>FORTIGATE</strong></div>
        <div className="topology-node node-sites"><small>CONNECTIVITY</small><strong>RAK ⇄ AUH</strong></div>
        <div className="topology-node node-dr"><small>RESILIENCE</small><strong>BACKUP · DR</strong></div>
      </div>
    );
  }

  if (project.visual === "erp") {
    return (
      <div className={`project-cover system-cover erp-cover ${compact ? "is-compact" : ""}`} aria-label="SAP business process illustration">
        <div className="cover-label"><span>BUSINESS SYSTEM</span><b>PRODUCTION ERP</b></div>
        <div className="erp-flow" aria-hidden="true">
          <div><small>01</small><strong>WAREHOUSE</strong><span>Inventory · Interbranch</span></div>
          <i>→</i>
          <div><small>02</small><strong>PRODUCTION</strong><span>BOM · Pallets · Costing</span></div>
          <i>→</i>
          <div><small>03</small><strong>REPORTING</strong><span>SQL · Customer · Operations</span></div>
        </div>
        <div className="hana-core" aria-hidden="true"><span>SAP BUSINESS ONE</span><strong>HANA</strong><i>Operational data layer</i></div>
      </div>
    );
  }

  if (project.visual === "delivery") {
    return (
      <div className={`project-cover system-cover delivery-cover ${compact ? "is-compact" : ""}`} aria-label="Delivery platform event architecture illustration">
        <div className="cover-label"><span>OPERATIONS ARCHITECTURE</span><b>PRIVATE PLATFORM</b></div>
        <div className="delivery-lanes" aria-hidden="true">
          <div><small>01</small><strong>ORDER</strong><span>Customer · Coupon</span></div>
          <div><small>02</small><strong>DISPATCH</strong><span>Driver · Route</span></div>
          <div><small>03</small><strong>DELIVERY</strong><span>Mobile · WATI</span></div>
          <div><small>04</small><strong>OUTBOX</strong><span>SAP sync deferred</span></div>
        </div>
        <div className="event-stream" aria-hidden="true"><i /><i /><i /><i /><span>POSTGRESQL EVENT STREAM</span></div>
      </div>
    );
  }

  if (project.visual === "crm") {
    return (
      <div className={`project-cover system-cover crm-cover ${compact ? "is-compact" : ""}`} aria-label="Private dealership system architecture illustration">
        <div className="cover-label"><span>DEALERSHIP OPERATIONS</span><b>PRIVATE APPLICATION</b></div>
        <div className="crm-core" aria-hidden="true"><small>CONTROLLED WORKSPACE</small><strong>FALCON CRM</strong><span>Arabic · English</span></div>
        <div className="crm-modules" aria-hidden="true"><span>CUSTOMERS</span><span>VEHICLES</span><span>FINANCE</span><span>TRANSACTIONS</span><span>DOCUMENTS</span><span>SEARCH / EXPORT</span></div>
        <div className="crm-lock" aria-hidden="true"><i /><span>PRIVATE RECORDS</span></div>
      </div>
    );
  }

  if (project.visual === "security") {
    return (
      <div className={`project-cover system-cover security-cover ${compact ? "is-compact" : ""}`} aria-label="Cybersecurity control layers illustration">
        <div className="cover-label"><span>DEFENCE IN DEPTH</span><b>ENTERPRISE PROGRAM</b></div>
        <div className="security-rings" aria-hidden="true"><i /><i /><i /><strong>AD</strong></div>
        <div className="security-controls" aria-hidden="true"><span>GPO</span><span>LAPS</span><span>APPLOCKER</span><span>DEFENDER</span><span>ASR</span><span>AUDIT</span></div>
      </div>
    );
  }

  if (project.visual === "hrms") {
    return (
      <div className={`project-cover system-cover hrms-cover ${compact ? "is-compact" : ""}`} aria-label="HRMS attendance data flow illustration">
        <div className="cover-label"><span>BUSINESS OPERATIONS</span><b>INTERNAL SYSTEM</b></div>
        <div className="hrms-grid" aria-hidden="true">
          <div><small>INPUT</small><strong>HIKVISION</strong><span>ZKTeco BioTime</span></div>
          <div><small>LOGIC</small><strong>SHIFTS</strong><span>Late · Overtime · Absence</span></div>
          <div><small>OUTPUT</small><strong>HRMS</strong><span>People · Structure · Dashboards</span></div>
        </div>
      </div>
    );
  }

  if (project.visual === "seo") {
    return (
      <div className={`project-cover system-cover seo-cover ${compact ? "is-compact" : ""}`} aria-label="Website and SEO transformation illustration">
        <div className="cover-label"><span>WEB TRANSFORMATION</span><b>CLIENT WORK</b></div>
        <div className="seo-signal" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="seo-layers" aria-hidden="true"><span>STRUCTURE</span><span>CONTENT</span><span>PERFORMANCE</span><span>SCHEMA</span><span>CONVERSION</span></div>
      </div>
    );
  }

  return <div className="project-cover system-cover"><div className="cover-label"><span>SYSTEM CASE STUDY</span><b>{project.status}</b></div></div>;
}

function ProjectActions({ project, onCaseStudy }: { project: Project; onCaseStudy: () => void }) {
  return (
    <div className="project-actions">
      <button type="button" className="case-link" onClick={onCaseStudy}>Explore case study <span>→</span></button>
      {project.liveUrl && (
        <a className="public-link" href={project.liveUrl} target="_blank" rel="noreferrer">View live <span>↗</span></a>
      )}
    </div>
  );
}

function CaseStudyDrawer({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="case-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <article className="case-drawer" role="dialog" aria-modal="true" aria-labelledby="case-title">
        <div className="case-drawer-head">
          <span>CASE STUDY · {project.index}</span>
          <button type="button" onClick={onClose} aria-label="Close case study">Close <i>×</i></button>
        </div>
        <div className="case-drawer-title">
          <div><p>{project.projectType}</p><h2 id="case-title">{project.title}</h2></div>
          <StatusPill project={project} />
        </div>
        <ProjectVisual project={project} />
        <div className="case-drawer-body">
          <section><span>Challenge</span><p>{project.challenge}</p></section>
          <section><span>Approach</span><p>{project.approach}</p></section>
          <section className="case-role"><span>My role</span><p>{project.role}</p></section>
          <section className="case-solution"><span>Solution</span><p>{project.solution}</p></section>
          <section className="case-capabilities"><span>System scope</span><ul>{project.capabilities.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section className="case-technologies"><span>Technologies & platforms</span><div>{project.technologies.map((item) => <i key={item}>{item}</i>)}</div></section>
          <section className="case-status"><span>Status</span><p>{project.statusNote}</p></section>
        </div>
        <div className="case-drawer-foot">
          <p>{project.status}</p>
          <div>
            {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">View live deployment ↗</a>}
            {project.relatedUrl && <a href={project.relatedUrl} target="_blank" rel="noreferrer">{project.relatedUrlLabel ?? "View related public project"} ↗</a>}
          </div>
        </div>
      </article>
    </div>
  );
}

function SiteHeader({ view, menuOpen, scrolled, dubaiTime, onMenu, onHome, onWork, onAnchor }: {
  view: View;
  menuOpen: boolean;
  scrolled: boolean;
  dubaiTime: string;
  onMenu: () => void;
  onHome: () => void;
  onWork: () => void;
  onAnchor: (id: string) => void;
}) {
  return (
    <header className={`site-header ${scrolled || view === "work" ? "is-scrolled" : ""}`}>
      <a className="wordmark" href="/" aria-label="Amin — home" onClick={(event) => { event.preventDefault(); onHome(); }}>
        <span>AM</span><i /><small>Systems &<br />software</small>
      </a>
      <nav className={menuOpen ? "is-open" : ""} aria-label="Primary navigation">
        <a href="/work" onClick={(event) => { event.preventDefault(); onWork(); }}>Work</a>
        <a href="/#about" onClick={(event) => { event.preventDefault(); onAnchor("about"); }}>About</a>
        <a href="/#capabilities" onClick={(event) => { event.preventDefault(); onAnchor("capabilities"); }}>Capabilities</a>
        <a href="/#contact" onClick={(event) => { event.preventDefault(); onAnchor("contact"); }}>Contact</a>
      </nav>
      <div className="header-actions">
        <span className="dubai-clock"><i>DXB</i>{dubaiTime || "GMT+4"}</span>
        <span className="availability"><i /> Available for select projects</span>
        <button className="menu-button" type="button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={onMenu}><span /><span /></button>
      </div>
    </header>
  );
}

function ContactFooter() {
  return (
    <footer className="contact" id="contact">
      <div className="contact-orbit" aria-hidden="true"><i /><i /><i /></div>
      <div className="contact-top reveal-up" data-reveal><span>Business-critical technology, thoughtfully built.</span><span>Let’s make it real.</span></div>
      <a className="contact-title reveal-up" data-reveal href="mailto:info@Haak-org.com">Start a<br /><em>conversation.</em><b>↗</b></a>
      <div className="contact-bottom">
        <div className="contact-identity"><strong>Amin</strong><span>Software · Enterprise IT · Digital Transformation</span></div>
        <div className="contact-links"><a href="mailto:info@Haak-org.com">Email ↗</a><a href="https://wa.me/971551686040" target="_blank" rel="noreferrer">WhatsApp ↗</a><a href="#top">Back to top ↑</a></div>
        <p>Dubai, UAE<br />© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}

function HomeView({ openCaseStudy, onViewAll }: { openCaseStudy: (project: Project) => void; onViewAll: () => void }) {
  return (
    <>
      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-kicker reveal-up" data-reveal><span>Software engineering</span><span>Enterprise IT</span><span>Digital transformation</span></div>
        <HeroProjectShowcase />
        <h1 className="hero-title reveal-up" data-reveal>Business-critical<span>systems, <em>built well.</em></span></h1>
        <div className="hero-bottom reveal-up" data-reveal>
          <p>I design, build and transform the technology businesses rely on—from mobile products and ERP workflows to infrastructure, security and digital commerce.</p>
          <a className="round-link" href="#work" aria-label="Explore selected work"><span>Explore<br />the work</span><b>↓</b></a>
        </div>
        <div className="hero-orbit" aria-hidden="true"><span className="orbit-dot" /><span className="orbit-label">Product × Systems × Infrastructure</span></div>
      </section>

      <section className="proof-strip" aria-label="Scope of work">
        <div><strong>03</strong><span>Verified public<br />deployments</span></div>
        <div><strong>PROD</strong><span>Private systems &<br />environments</span></div>
        <div><strong>EN / AR</strong><span>Multilingual<br />products</span></div>
        <div><strong>UAE</strong><span>Enterprise &<br />regional context</span></div>
      </section>

      <section className="motion-marquee" aria-label="Areas of expertise"><div className="motion-marquee-track">{[0, 1].map((group) => <div key={group} aria-hidden={group === 1}><span>Software engineering</span><i>✦</i><span>Enterprise systems</span><i>✦</i><span>Infrastructure</span><i>✦</i><span>Cybersecurity</span><i>✦</i><span>ERP / SAP</span><i>✦</i><span>Mobile products</span><i>✦</i></div>)}</div></section>

      <section className="work-intro section-shell" id="work">
        <div className="section-label reveal-up" data-reveal><span>01</span><p>Selected work</p></div>
        <div className="work-heading reveal-up" data-reveal><h2>Systems with real responsibility.</h2><p>Public products are only one part of the story. This work also spans private platforms, production infrastructure, ERP, cybersecurity and enterprise transformation.</p></div>
      </section>

      <section className="featured-work section-shell" aria-label="Featured case studies">
        {featuredProjects.map((project) => (
          <article className={`featured-card feature-${project.visual} reveal-up`} data-reveal key={project.slug}>
            <div className="featured-card-head"><span>{project.index} · {project.category}</span><StatusPill project={project} /></div>
            <ProjectVisual project={project} />
            <div className="featured-card-copy"><p>{project.projectType}</p><h3>{project.shortTitle}</h3><strong>{project.shortDescription}</strong><small><b>Role</b>{project.role}</small><div className="tech-line">{project.technologies.slice(0, 4).map((item) => <i key={item}>{item}</i>)}</div><ProjectActions project={project} onCaseStudy={() => openCaseStudy(project)} /></div>
          </article>
        ))}
        <button type="button" className="all-work-cta reveal-up" data-reveal onClick={onViewAll}><span>Explore the broader portfolio</span><strong>View all work</strong><i>→</i></button>
      </section>

      <section className="live-surfaces section-shell" aria-label="Public product surfaces">
        <div className="section-label reveal-up" data-reveal><span>LIVE</span><p>Public product surfaces</p></div>
        <div className="live-surfaces-heading reveal-up" data-reveal>
          <h2>Real work,<br /><em>in the wild.</em></h2>
          <p>Three public deployments provide a direct view into the interface craft, responsive execution and product thinking behind the broader systems work.</p>
        </div>
        <div className="surface-grid">
          {publicSurfaceProjects.map((project, index) => (
            <a className={`surface-card surface-card-${index + 1} reveal-up`} data-reveal href={project.liveUrl} target="_blank" rel="noreferrer" key={project.slug}>
              <div className="surface-browser">
                <div className="surface-browser-bar"><span><i /><i /><i /></span><small>{project.liveUrl?.replace("https://", "").replace(/\/$/, "")}</small><b>LIVE ↗</b></div>
                <img src={project.coverAsset} alt={project.coverAlt ?? `${project.shortTitle} public website`} />
              </div>
              <div className="surface-copy"><span>0{index + 1} · {project.category}</span><h3>{project.shortTitle}</h3><p>{project.shortDescription}</p><i>Open live project ↗</i></div>
            </a>
          ))}
        </div>
      </section>

      <section className="about section-shell" id="about">
        <div className="section-label light reveal-up" data-reveal><span>02</span><p>How I work</p></div>
        <div className="about-copy reveal-up" data-reveal><p className="eyebrow">Business context. Technical depth. Operational reality.</p><h2>I work where software, infrastructure and business operations <em>meet.</em></h2></div>
        <div className="about-detail reveal-up" data-reveal><p>The work is deliberately broad because real transformation rarely stays inside one discipline. A mobile ordering product can depend on identity, payments, delivery operations, backend data and future ERP integration.</p><p>I translate that complexity into systems that are understandable, controlled and appropriate for the environment—whether the output is public, private, internal or production infrastructure.</p></div>
      </section>

      <section className="capabilities section-shell" id="capabilities">
        <div className="section-label reveal-up" data-reveal><span>03</span><p>Capabilities demonstrated</p></div>
        <div className="capability-list">{capabilities.map(([number, title, description]) => <div className="capability reveal-up" data-reveal key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p><i>↗</i></div>)}</div>
      </section>

      <section className="stack-section section-shell">
        <div className="section-label reveal-up" data-reveal><span>04</span><p>Working landscape</p></div>
        <div className="stack-layout reveal-up" data-reveal><h2>Broad scope.<br /><em>One systems view.</em></h2><div className="stack-groups"><div><span>Software</span><p>React · Next.js · Mobile applications · APIs · PostgreSQL · Supabase · Authentication</p></div><div><span>Enterprise</span><p>SAP Business One · SAP HANA · SQL reporting · HRMS · Business process design</p></div><div><span>Infrastructure</span><p>Proxmox · Windows Server · Active Directory · FortiGate · VLANs · VPN · Backup · DR</p></div><div><span>Delivery</span><p>Vercel · Cloudflare · Integrations · Technical SEO · Performance · Security hardening</p></div></div></div>
      </section>
      <ContactFooter />
    </>
  );
}

function WorkView({ category, onCategory, openCaseStudy }: { category: "All" | ProjectCategory; onCategory: (category: "All" | ProjectCategory) => void; openCaseStudy: (project: Project) => void }) {
  const visibleProjects = category === "All" ? projects : projects.filter((project) => project.category === category);
  return (
    <div className="work-page" id="top">
      <section className="work-page-hero section-shell">
        <div className="section-label reveal-up" data-reveal><span>WORK</span><p>Public products · Private systems · Enterprise programs</p></div>
        <div className="work-page-title reveal-up" data-reveal><p>Selected systems and transformation work across software, mobile, enterprise IT, infrastructure, cybersecurity and ERP.</p><h1>A wider view<br />of the <em>work.</em></h1></div>
      </section>
      <section className="work-index section-shell">
        <div className="work-filters" role="group" aria-label="Filter projects">{projectCategories.map((item) => <button type="button" key={item} className={category === item ? "is-active" : ""} onClick={() => onCategory(item)}>{item}<span>{item === "All" ? projects.length : projects.filter((project) => project.category === item).length}</span></button>)}</div>
        <div className="work-list" aria-live="polite">
          {visibleProjects.map((project) => (
            <article className="work-row reveal-up" data-reveal key={project.slug}>
              <div className="work-row-index">{project.index}</div>
              <div className="work-row-visual"><ProjectVisual project={project} compact /></div>
              <div className="work-row-copy"><p>{project.projectType}</p><h2>{project.shortTitle}</h2><strong>{project.shortDescription}</strong><small><b>Role</b>{project.role}</small><div className="tech-line">{project.technologies.slice(0, 5).map((item) => <i key={item}>{item}</i>)}</div></div>
              <div className="work-row-side"><StatusPill project={project} /><ProjectActions project={project} onCaseStudy={() => openCaseStudy(project)} /></div>
            </article>
          ))}
        </div>
      </section>
      <ContactFooter />
    </div>
  );
}

export default function Home({ initialView = "home" }: { initialView?: View }) {
  const [view, setView] = useState<View>(initialView);
  const [category, setCategory] = useState<"All" | ProjectCategory>("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dubaiTime, setDubaiTime] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const syncRoute = () => setView(window.location.pathname.startsWith("/work") ? "work" : "home");
    syncRoute();
    window.addEventListener("popstate", syncRoute);
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  useEffect(() => {
    const updateClock = () => setDubaiTime(new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dubai", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date()));
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--scroll-progress", String(maximum > 0 ? window.scrollY / maximum : 0));
    };
    const onPointerMove = (event: PointerEvent) => { document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`); document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`); };
    updateClock(); onScroll();
    const clock = window.setInterval(updateClock, 30000);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => { window.clearInterval(clock); window.removeEventListener("scroll", onScroll); window.removeEventListener("pointermove", onPointerMove); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: 0.1 });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [view, category]);

  useEffect(() => {
    if (!selectedProject) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setSelectedProject(null);
    document.body.classList.add("has-dialog");
    window.addEventListener("keydown", onKey);
    return () => { document.body.classList.remove("has-dialog"); window.removeEventListener("keydown", onKey); };
  }, [selectedProject]);

  const navigate = (next: View) => {
    setMenuOpen(false); setView(next); window.history.pushState({}, "", next === "work" ? "/work" : "/"); window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goToAnchor = (id: string) => {
    setMenuOpen(false);
    if (view !== "home") { setView("home"); window.history.pushState({}, "", `/#${id}`); window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 50); }
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <CosmosStage />
      <div className="pointer-glow" aria-hidden="true" />
      <SiteHeader view={view} menuOpen={menuOpen} scrolled={scrolled} dubaiTime={dubaiTime} onMenu={() => setMenuOpen((open) => !open)} onHome={() => navigate("home")} onWork={() => navigate("work")} onAnchor={goToAnchor} />
      {view === "home" ? <HomeView openCaseStudy={setSelectedProject} onViewAll={() => navigate("work")} /> : <WorkView category={category} onCategory={setCategory} openCaseStudy={setSelectedProject} />}
      {selectedProject && <CaseStudyDrawer project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </main>
  );
}
