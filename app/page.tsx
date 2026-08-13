"use client";

import { useEffect, useState } from "react";

const projects = [
  {
    index: "01",
    title: "Falcon CRM",
    type: "Operations system",
    year: "2026",
    url: "https://falcon-crm-xi.vercel.app/",
    image: "/projects/falcon-crm.png",
    imageAlt: "Falcon CRM secure dealership workspace sign-in screen",
    statement: "A private command centre for dealership operations.",
    detail:
      "Falcon replaces fragmented customer, deal, finance and document workflows with one controlled workspace—designed around staff permissions, operational clarity and accountability.",
    challenge:
      "Sensitive dealership records need to move quickly between teams without losing control, history or ownership.",
    system: [
      "Role-based access",
      "Customer & deal records",
      "Finance workflows",
      "Document management",
      "Audit history",
      "Arabic / English interface",
    ],
    stack: ["Next.js", "Secure sessions", "Database-backed", "RBAC"],
    tone: "gold",
  },
  {
    index: "02",
    title: "Sahaba Water",
    type: "Bilingual commerce",
    year: "2024",
    url: "https://sahaba-frontend.vercel.app/",
    image: "/projects/sahaba.png",
    imageAlt: "Sahaba Water ecommerce landing page",
    statement: "A polished direct-to-consumer water storefront.",
    detail:
      "A refined bilingual shopping experience that turns a local water brand into a digital retail product—combining product discovery, quantities, cart flows and account access in a cohesive interface.",
    challenge:
      "Make everyday hydration feel premium while keeping the path from product discovery to purchase effortless on every device.",
    system: [
      "Product catalogue",
      "Cart & quantity flows",
      "Customer accounts",
      "Arabic / English UI",
      "Responsive commerce",
      "Google identity integration",
    ],
    stack: ["React", "REST commerce", "i18n", "Google Identity"],
    tone: "cyan",
  },
  {
    index: "03",
    title: "Alrawdah Springs",
    type: "Commerce ecosystem",
    year: "2026",
    url: "https://rswater.ae/",
    image: "/projects/rs-water.png",
    imageAlt: "Alrawdah Springs online water delivery storefront",
    statement: "A full-scale digital sales channel serving all seven Emirates.",
    detail:
      "A conversion-focused commerce platform with a deep product catalogue, bundled offers, customer accounts, order tracking, delivery coverage, localized content and consent-aware marketing analytics.",
    challenge:
      "Unify consumer sales, bulk ordering, regional delivery and brand storytelling in one fast, trustworthy destination.",
    system: [
      "Catalogue & cart",
      "Account and order tracking",
      "Bulk offers",
      "Seven-emirate delivery",
      "Consent-managed analytics",
      "Arabic / English experience",
    ],
    stack: ["Custom commerce", "Cloudflare", "Meta / TikTok pixels", "SEO architecture"],
    tone: "violet",
  },
  {
    index: "04",
    title: "HAAK Solutions",
    type: "Service platform",
    year: "2026",
    url: "https://haak-sigma.vercel.app/",
    image: "/projects/haak.png",
    imageAlt: "HAAK Solutions digital agency website",
    statement: "A lead-generation platform for an integrated digital agency.",
    detail:
      "A clear, multi-page business presence that packages development, UI/UX, marketing and growth services into a credible acquisition journey with portfolio proof and focused conversion paths.",
    challenge:
      "Make a broad service offering immediately understandable—and move qualified visitors from interest to conversation.",
    system: [
      "Service architecture",
      "Portfolio presentation",
      "Lead-generation flows",
      "Multi-page navigation",
      "Responsive UI",
      "Search-ready content",
    ],
    stack: ["React", "Vite", "Component system", "Responsive design"],
    tone: "blue",
  },
];

const capabilities = [
  ["01", "Product engineering", "From operational requirements to resilient, usable software—not just attractive screens."],
  ["02", "Commerce systems", "Catalogues, carts, accounts, fulfilment journeys and conversion-minded storefronts."],
  ["03", "Internal platforms", "Secure workflows, permissions, records and dashboards built around how teams actually operate."],
  ["04", "Frontend craft", "Responsive interfaces with deliberate hierarchy, motion, accessibility and interaction detail."],
  ["05", "Integrations", "Identity, analytics, APIs and third-party services connected into coherent product experiences."],
  ["06", "Technical strategy", "Architecture and delivery decisions shaped by business goals, scale and long-term ownership."],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dubaiTime, setDubaiTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      setDubaiTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Dubai",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date()),
      );
    };

    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const maximum = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maximum > 0 ? window.scrollY / maximum : 0;
      document.documentElement.style.setProperty("--scroll-progress", String(progress));

      document.querySelectorAll<HTMLElement>(".project-visual").forEach((visual) => {
        const rect = visual.getBoundingClientRect();
        const distance = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight;
        visual.style.setProperty("--parallax", `${Math.max(-24, Math.min(24, distance * -22))}px`);
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      document.documentElement.style.setProperty("--pointer-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    updateClock();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    const clock = window.setInterval(updateClock, 30000);

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.14 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => revealObserver.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.clearInterval(clock);
      revealObserver.disconnect();
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const tiltProject = (event: React.PointerEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-x", `${y * -3.2}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${x * 4.2}deg`);
    event.currentTarget.style.setProperty("--shine-x", `${(x + 0.5) * 100}%`);
    event.currentTarget.style.setProperty("--shine-y", `${(y + 0.5) * 100}%`);
  };

  const resetProjectTilt = (event: React.PointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <main>
      <div className="pointer-glow" aria-hidden="true" />
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="wordmark" href="#top" aria-label="Amin — home" onClick={closeMenu}>
          <span>AM</span>
          <i />
          <small>Independent<br />developer</small>
        </a>

        <nav className={menuOpen ? "is-open" : ""} aria-label="Primary navigation">
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#capabilities" onClick={closeMenu}>Capabilities</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>

        <div className="header-actions">
          <span className="dubai-clock"><i>DXB</i>{dubaiTime || "GMT+4"}</span>
          <span className="availability"><i /> Available for select projects</span>
          <button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-kicker reveal-up" data-reveal>
          <span>Software developer</span>
          <span>Digital solutions builder</span>
          <span>Dubai, UAE</span>
        </div>
        <h1 className="hero-title reveal-up" data-reveal>
          Digital products
          <span>built to <em>operate.</em></span>
        </h1>
        <div className="hero-bottom reveal-up" data-reveal>
          <p>
            I design and build serious digital systems—from secure internal platforms to
            customer-facing commerce experiences.
          </p>
          <a className="round-link" href="#work" aria-label="Explore selected work">
            <span>Explore<br />the work</span>
            <b>↓</b>
          </a>
        </div>
        <div className="hero-orbit" aria-hidden="true">
          <span className="orbit-dot" />
          <span className="orbit-label">Strategy × Design × Engineering</span>
        </div>
      </section>

      <section className="proof-strip" aria-label="Expertise summary">
        <div><strong>04</strong><span>Live products<br />in market</span></div>
        <div><strong>02</strong><span>Languages<br />EN / AR</span></div>
        <div><strong>360°</strong><span>Product thinking<br />to deployment</span></div>
        <div><strong>UAE</strong><span>Built for regional<br />business realities</span></div>
      </section>

      <section className="motion-marquee" aria-label="Areas of expertise">
        <div className="motion-marquee-track">
          {[0, 1].map((group) => (
            <div key={group} aria-hidden={group === 1}>
              <span>Product engineering</span><i>✦</i>
              <span>Secure systems</span><i>✦</i>
              <span>Commerce platforms</span><i>✦</i>
              <span>Digital experiences</span><i>✦</i>
              <span>Built for production</span><i>✦</i>
            </div>
          ))}
        </div>
      </section>

      <section className="work-intro section-shell" id="work">
        <div className="section-label reveal-up" data-reveal>
          <span>01</span>
          <p>Selected work</p>
        </div>
        <div className="work-heading reveal-up" data-reveal>
          <h2>Products with a job to do.</h2>
          <p>
            Each project starts with a real operational or commercial problem. The result is
            a working product—not a concept, mockup or template.
          </p>
        </div>
      </section>

      <section className="projects" aria-label="Project case studies">
        {projects.map((project) => (
          <article className={`project project-${project.tone}`} key={project.title}>
            <div className="project-sticky section-shell">
              <div className="project-meta reveal-up" data-reveal>
                <span>{project.index}</span>
                <p>{project.type}</p>
                <p>{project.year}</p>
              </div>

              <div className="project-title-row reveal-up" data-reveal>
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.statement}</p>
                </div>
                <a href={project.url} target="_blank" rel="noreferrer" className="live-link">
                  View live <span>↗</span>
                </a>
              </div>

              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="project-visual reveal-up"
                data-reveal
                aria-label={`Open ${project.title} live project`}
                onPointerMove={tiltProject}
                onPointerLeave={resetProjectTilt}
              >
                <div className="browser-chrome">
                  <span><i /><i /><i /></span>
                  <small>{project.url.replace("https://", "").replace(/\/$/, "")}</small>
                  <b>LIVE ↗</b>
                </div>
                <img src={project.image} alt={project.imageAlt} />
                <span className="visual-badge"><i /> Case study {project.index}</span>
                <div className="visual-sheen" />
              </a>

              <div className="case-grid reveal-up" data-reveal>
                <div className="case-narrative">
                  <span>What it solves</span>
                  <p>{project.detail}</p>
                </div>
                <div className="case-challenge">
                  <span>The challenge</span>
                  <p>{project.challenge}</p>
                </div>
                <div className="case-system">
                  <span>System scope</span>
                  <ul>
                    {project.system.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
                <div className="case-stack">
                  <span>Technical signals</span>
                  <div>
                    {project.stack.map((item) => <i key={item}>{item}</i>)}
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="about section-shell" id="about">
        <div className="section-label light reveal-up" data-reveal>
          <span>02</span>
          <p>About the practice</p>
        </div>
        <div className="about-copy reveal-up" data-reveal>
          <p className="eyebrow">Design judgement. Engineering discipline. Business context.</p>
          <h2>
            I work at the point where a product must <em>look right</em>, work reliably and
            make commercial sense.
          </h2>
        </div>
        <div className="about-detail reveal-up" data-reveal>
          <p>
            My work spans secure operational software, commerce, brand platforms and the
            integrations that connect them. I care about the details users notice—and the
            architecture, permissions and edge cases they should never have to notice.
          </p>
          <p>
            The goal is straightforward: translate business complexity into digital products
            that feel clear, credible and built to last.
          </p>
        </div>
      </section>

      <section className="capabilities section-shell" id="capabilities">
        <div className="section-label reveal-up" data-reveal>
          <span>03</span>
          <p>Capabilities</p>
        </div>
        <div className="capability-list">
          {capabilities.map(([number, title, description]) => (
            <div className="capability reveal-up" data-reveal key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <i>↗</i>
            </div>
          ))}
        </div>
      </section>

      <section className="stack-section section-shell">
        <div className="section-label reveal-up" data-reveal>
          <span>04</span>
          <p>Working stack</p>
        </div>
        <div className="stack-layout reveal-up" data-reveal>
          <h2>Modern tools.<br /><em>Pragmatic choices.</em></h2>
          <div className="stack-groups">
            <div><span>Frontend</span><p>React · Next.js · TypeScript · Vite · Responsive UI · Motion</p></div>
            <div><span>Systems</span><p>Node.js · REST APIs · Databases · Authentication · RBAC</p></div>
            <div><span>Commerce</span><p>Product catalogues · Cart flows · Accounts · Order journeys · Analytics</p></div>
            <div><span>Delivery</span><p>Vercel · Cloudflare · Performance · SEO · Accessibility · Observability</p></div>
          </div>
        </div>
      </section>

      <footer className="contact" id="contact">
        <div className="contact-orbit" aria-hidden="true"><i /><i /><i /></div>
        <div className="contact-top reveal-up" data-reveal>
          <span>Have a serious product to build?</span>
          <span>Let’s make it real.</span>
        </div>
        <a className="contact-title reveal-up" data-reveal href="mailto:info@Haak-org.com">
          Start a<br /><em>conversation.</em><b>↗</b>
        </a>
        <div className="contact-bottom">
          <div className="contact-identity">
            <strong>Amin</strong>
            <span>Software Developer & Digital Solutions Builder</span>
          </div>
          <div className="contact-links">
            <a href="mailto:info@Haak-org.com">Email ↗</a>
            <a href="https://wa.me/971551686040" target="_blank" rel="noreferrer">WhatsApp ↗</a>
            <a href="#top">Back to top ↑</a>
          </div>
          <p>Dubai, UAE<br />© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  );
}
