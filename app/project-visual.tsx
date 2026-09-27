import { imageSizes, type Project } from "./project-data";

type VisualProps = { project: Project; compact?: boolean; priority?: boolean };

const statusBadge = (project: Project) =>
  project.statusKind === "private" ? "PRIVATE / INTERNAL" : project.liveUrl ? "PUBLIC" : "BUILD / CASE STUDY";

function Img({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  const size = imageSizes[src];
  return (
    <img
      src={src}
      alt={alt}
      width={size?.width}
      height={size?.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
    />
  );
}

const ticketLanes: Array<[string, Array<[string, string]>]> = [
  ["OPEN", [["IT SUPPORT", "P1"], ["DELIVERY ISSUE", "P2"]]],
  ["ASSIGNED", [["EMPLOYEE REQUEST", "P3"]]],
  ["REPORTING", [["ADMIN DASHBOARD", "ALL"]]],
];

/** Illustrations for work without imagery: honest, schematic, CSS/SVG only. */
function SystemScene({ project }: { project: Project }) {
  switch (project.visual) {
    case "storefront":
      return (
        <div className="scene scene-storefront" aria-hidden="true">
          <div className="y2k-orb" />
          <div className="storefront-grid">
            {["01", "02", "03"].map((item) => <div className="storefront-tile" key={item}><i /><span>ITEM {item}</span></div>)}
          </div>
          <div className="storefront-rail"><span>SHOPIFY STOREFRONT API</span><b>→</b><span>REACT</span></div>
          <div className="storefront-marquee"><span>KIFAYA ✦ ARAB Y2K ✦ STREETWEAR ✦ KIFAYA ✦ ARAB Y2K ✦ STREETWEAR ✦</span></div>
        </div>
      );
    case "brand-3d":
      return (
        <div className="scene scene-brand3d" aria-hidden="true">
          <div className="bottle-ring" />
          <div className="bottle"><i /></div>
          <div className="bottle-variants"><span>STILL</span><span>SPARKLING</span></div>
          <div className="bottle-palette"><i /><i /><i /></div>
        </div>
      );
    case "tickets":
      return (
        <div className="scene scene-tickets" aria-hidden="true">
          {ticketLanes.map(([lane, tickets]) => (
            <div className="ticket-lane" key={lane}>
              <small>{lane}</small>
              {tickets.map(([title, tag]) => <div className="ticket" key={title}><b>{title}</b><span>{tag}</span></div>)}
            </div>
          ))}
          <div className="ticket-auth"><span>JWT</span><span>ROLES</span><span>MYSQL 8</span><span>DOCKER</span></div>
        </div>
      );
    case "desktop":
      return (
        <div className="scene scene-desktop" aria-hidden="true">
          <div className="desktop-window">
            <div className="desktop-bar"><i /><i /><i /><span>BOTTLE TRACKING</span></div>
            <div className="desktop-body">
              <div className="desktop-side"><span>INVENTORY</span><span>MOVEMENTS</span><span>CHARTS</span></div>
              <div className="desktop-chart">{[42, 64, 38, 76, 58, 88, 50].map((height, index) => <i style={{ height: `${height}%` }} key={index} />)}</div>
            </div>
          </div>
          <div className="desktop-stack"><span>ELECTRON</span><span>SUPABASE</span><span>RECHARTS</span></div>
        </div>
      );
    case "dispatch":
      return (
        <div className="scene scene-dispatch" aria-hidden="true">
          <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice">
            <g className="dispatch-streets">
              <path d="M0 60 H400 M0 140 H400 M0 205 H400 M70 0 V250 M180 0 V250 M300 0 V250 M0 250 L250 0 M120 250 L400 30" />
            </g>
            <path className="dispatch-zone" d="M30 30 L190 20 L215 120 L110 170 L25 125 Z" />
            <path className="dispatch-zone is-alt" d="M230 110 L380 70 L390 210 L260 235 Z" />
            <path className="dispatch-route" pathLength={1} d="M70 140 L70 60 L180 60 L180 140 L300 140 L300 205" />
            {[[70, 140], [180, 60], [180, 140], [300, 205]].map(([x, y]) => <circle className="dispatch-pin" cx={x} cy={y} r="5" key={`${x}-${y}`} />)}
          </svg>
          <div className="dispatch-legend"><span><i className="is-zone" />ZONES</span><span><i className="is-route" />ROUTE</span><span><i className="is-pin" />PINS</span><span>TIME WINDOWS</span></div>
        </div>
      );
    case "social":
      return (
        <div className="scene scene-social" aria-hidden="true">
          <div className="squad-card"><small>SQUAD</small><div className="squad-avatars"><i /><i /><i /><i /></div><span>MATCHMAKING</span></div>
          <div className="chat-stack">
            <p className="chat-bubble">gg — queue again?</p>
            <p className="chat-bubble is-own" dir="rtl" lang="ar">يلا نلعب</p>
            <p className="chat-live"><i />SOCKET.IO LIVE</p>
          </div>
          <div className="social-tabs"><span>DISCOVER</span><span>FEED</span><span>SQUADS</span><span>CHAT</span></div>
        </div>
      );
    default:
      return (
        <div className="scene scene-generic" aria-hidden="true">
          {project.capabilities.slice(0, 6).map((item) => <span key={item}>{item}</span>)}
        </div>
      );
  }
}

export function ProjectVisual({ project, compact = false, priority = false }: VisualProps) {
  const size = compact ? " is-compact" : "";

  if (project.coverAsset) {
    return (
      <div className={`project-cover browser-cover${size}`}>
        <div className="browser-bar" aria-hidden="true">
          <span><i /><i /><i /></span>
          <small>{project.liveUrl?.replace("https://", "").replace(/\/$/, "")}</small>
          <b>{project.liveUrl ? "PUBLIC" : "CASE STUDY"}</b>
        </div>
        <Img src={project.coverAsset} alt={project.coverAlt ?? `${project.title} website`} priority={priority} />
      </div>
    );
  }

  if (project.conceptAsset) {
    return (
      <div className={`project-cover concept-cover${size}`}>
        <Img src={project.conceptAsset} alt={project.conceptAlt ?? `Concept visual for ${project.title}`} priority={priority} />
        <div className="concept-cover-shade" aria-hidden="true" />
        <div className="concept-cover-label">
          <span>CONCEPT VISUAL</span>
          <b>{project.statusKind === "private" ? "PRIVATE / REPRESENTATIVE" : "CASE STUDY / REPRESENTATIVE"}</b>
        </div>
      </div>
    );
  }

  return (
    <div className={`project-cover system-cover visual-${project.visual}${size}`} role="img" aria-label={`Schematic illustration of ${project.title}`}>
      <div className="cover-label" aria-hidden="true"><span>{project.projectType.split(" · ")[0]}</span><b>{statusBadge(project)}</b></div>
      <SystemScene project={project} />
    </div>
  );
}
