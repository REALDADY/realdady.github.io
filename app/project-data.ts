export type ProjectCategory =
  | "Products"
  | "Enterprise Systems"
  | "Infrastructure"
  | "Cybersecurity"
  | "ERP / SAP"
  | "Web";

export type VisualType =
  | "commerce"
  | "infrastructure"
  | "erp"
  | "practice"
  | "crm"
  | "delivery"
  | "security"
  | "hrms"
  | "browser"
  | "seo"
  | "storefront"
  | "brand-3d"
  | "tickets"
  | "desktop"
  | "dispatch"
  | "social";

export type Project = {
  index: string;
  slug: string;
  title: string;
  shortTitle: string;
  shortDescription: string;
  category: ProjectCategory;
  projectType: string;
  status: string;
  statusKind: "live" | "production" | "private" | "ongoing" | "program" | "case-study";
  featured: boolean;
  role: string;
  technologies: string[];
  capabilities: string[];
  liveUrl?: string;
  relatedUrl?: string;
  relatedUrlLabel?: string;
  coverAsset?: string;
  coverAlt?: string;
  conceptAsset?: string;
  conceptAlt?: string;
  visual: VisualType;
  challenge: string;
  approach: string;
  solution: string;
  statusNote: string;
};

export const projects: Project[] = [
  {
    index: "01",
    slug: "alrawdah-digital-commerce-platform",
    title: "Alrawdah Digital Commerce Platform",
    shortTitle: "Alrawdah Digital Platform",
    shortDescription:
      "A customer commerce ecosystem connecting ordering, payments, coupons, delivery and account management across mobile and web.",
    category: "Products",
    projectType: "Digital Commerce · Mobile Product · Enterprise Transformation",
    status: "Production / Ongoing Development",
    statusKind: "ongoing",
    featured: true,
    role: "Digital transformation · Product · Technical leadership",
    technologies: ["iOS", "Android", "Backend APIs", "PostgreSQL", "Supabase", "Payment gateway", "Push notifications"],
    capabilities: [
      "Customer accounts",
      "Online ordering",
      "Wallet and coupon system",
      "Payment gateway and COD",
      "Addresses and delivery tracking",
      "Arabic / English",
      "Admin platform",
      "UAE PASS integration work",
      "Apple Sign-In",
      "Future SAP integration",
    ],
    relatedUrl: "https://rswater.ae/",
    relatedUrlLabel: "View public commerce website",
    conceptAsset: "/projects/alrawdah-platform-concept.webp",
    conceptAlt: "Concept visual of a mobile mineral-water ordering product on two smartphones",
    visual: "commerce",
    challenge:
      "Bring a fragmented customer ordering journey into one product spanning mobile commerce, account services, fulfilment and administration.",
    approach:
      "Model the platform as connected customer, commerce, delivery and administration services, with bilingual experiences and integration points for identity, payments and future enterprise systems.",
    solution:
      "An iOS and Android commerce product supported by backend APIs, PostgreSQL / Supabase, customer accounts, wallet and coupon logic, payment and COD flows, delivery tracking, notifications and an administration platform.",
    statusNote:
      "The platform is a production and ongoing transformation initiative. Its mobile, backend and administration surfaces are not presented as public deployments.",
  },
  {
    index: "02",
    slug: "infrastructure-disaster-recovery-transformation",
    title: "IT Infrastructure & Disaster Recovery Transformation",
    shortTitle: "Infrastructure Transformation",
    shortDescription:
      "An enterprise infrastructure rebuild spanning virtualization, identity, SAP, networking, backup, security segmentation and disaster recovery.",
    category: "Infrastructure",
    projectType: "Enterprise Infrastructure · Resilience · Security",
    status: "Production Environment",
    statusKind: "production",
    featured: true,
    role: "Infrastructure architecture · Implementation · Resilience",
    technologies: ["Proxmox", "Windows Server", "Active Directory", "DNS", "SAP HANA", "FortiGate", "VLANs", "Site-to-site VPN"],
    capabilities: [
      "Virtualization",
      "Windows Server estate",
      "Active Directory and DNS",
      "SAP infrastructure and HANA",
      "File and jump servers",
      "FortiGate and VLAN segmentation",
      "RAK / Abu Dhabi connectivity",
      "Backup and disaster recovery",
    ],
    conceptAsset: "/projects/infrastructure-concept.webp",
    conceptAlt: "Concept visual of a real enterprise server room and infrastructure estate",
    visual: "infrastructure",
    challenge:
      "Rebuild a business-critical infrastructure estate so core services, SAP workloads and branch connectivity could operate within a controlled and recoverable environment.",
    approach:
      "Treat compute, identity, network segmentation, site connectivity, business applications and recovery as one architecture rather than isolated infrastructure tasks.",
    solution:
      "A Proxmox-based virtual environment with Windows Server services, Active Directory and DNS, SAP and HANA infrastructure, file and jump servers, FortiGate controls, VLAN segmentation, site-to-site VPN connectivity, backup and disaster-recovery design.",
    statusNote:
      "This is an enterprise production environment, not a public website or downloadable project.",
  },
  {
    index: "03",
    slug: "sap-business-one-hana-optimization",
    title: "SAP Business One / HANA Optimization",
    shortTitle: "SAP Business Systems",
    shortDescription:
      "ERP and operational reporting work connecting inventory, warehouse, production, costing and management information.",
    category: "ERP / SAP",
    projectType: "ERP · Business Systems · Operational Reporting",
    status: "Production Business System",
    statusKind: "production",
    featured: true,
    role: "Business systems · Reporting · Process improvement",
    technologies: ["SAP Business One", "SAP HANA", "SQL reporting", "Warehouse workflows", "BOM analysis", "Production costing"],
    capabilities: [
      "Inventory controls",
      "Interbranch transactions",
      "Warehouse workflows",
      "Production reporting",
      "BOM analysis",
      "Pallet tracking",
      "Customer reporting",
      "Operational reporting",
    ],
    conceptAsset: "/projects/sap-systems-concept.webp",
    conceptAlt: "Concept visual of an operational ERP dashboard inside a mineral-water warehouse",
    visual: "erp",
    challenge:
      "Turn ERP data and operational workflows into reliable controls and reporting for warehouse, inventory, production and management needs.",
    approach:
      "Work across process design, transaction flows, data structures and SQL reporting so operational information reflects how the business actually runs.",
    solution:
      "SAP Business One and HANA optimization covering warehouse workflows, inventory and interbranch controls, production and BOM analysis, pallet tracking, customer reporting, production costing and broader business-process improvement.",
    statusNote:
      "The work lives inside a production ERP environment and is presented as a business-systems case study.",
  },
  {
    index: "04",
    slug: "haak-solutions",
    title: "HAAK Solutions",
    shortTitle: "HAAK Solutions",
    shortDescription:
      "A bold, responsive brand experience translating a broad technology practice into a clear and energetic digital presence.",
    category: "Products",
    projectType: "Software Products · IT Solutions · Digital Transformation",
    status: "Public Website / Solutions Practice",
    statusKind: "live",
    featured: true,
    role: "Web design · Creative development · Interactive direction",
    technologies: ["React", "Vite", "Web applications", "Enterprise systems", "Responsive design"],
    capabilities: [
      "Software products",
      "Enterprise systems",
      "Web applications",
      "Digital transformation",
      "IT services",
      "Interactive web experiences",
    ],
    liveUrl: "https://haak-sigma.vercel.app/",
    coverAsset: "/projects/haak.png",
    coverAlt: "HAAK Solutions public website",
    visual: "practice",
    challenge:
      "Present a broad software, IT and digital-transformation capability as one coherent professional offering.",
    approach:
      "Use the public brand platform as the visible entry point while positioning HAAK around the wider systems, products and transformation work behind it.",
    solution:
      "A public multi-page website supported by a broader solutions practice covering software products, enterprise systems, web applications, digital transformation and IT services.",
    statusNote:
      "The HAAK website is public. The wider solutions work it represents includes both public and private engagements.",
  },
  {
    index: "05",
    slug: "falcon-crm",
    title: "Falcon CRM",
    shortTitle: "Falcon CRM",
    shortDescription:
      "A bilingual private dealership application controlling customer, vehicle, finance, transaction and document workflows.",
    category: "Enterprise Systems",
    projectType: "Private Business Application · CRM · Operations",
    status: "Private Business Application",
    statusKind: "private",
    featured: true,
    role: "Application design · Development · Workflow architecture",
    technologies: ["Next.js", "Secure sessions", "Database-backed workflows", "Arabic / English", "Excel export"],
    capabilities: [
      "Customer management",
      "Vehicle records",
      "Cash transactions",
      "Finance and loan sales",
      "File attachments",
      "ID, phone and name search",
      "Excel export",
      "Arabic / English support",
    ],
    conceptAsset: "/projects/falcon-crm-concept.webp",
    conceptAlt: "Concept visual of a private dealership CRM on a laptop in a premium showroom",
    visual: "crm",
    challenge:
      "Give dealership staff one controlled system for customer, vehicle, cash, finance and document records without exposing operational data publicly.",
    approach:
      "Design the application around dealership workflows, fast multi-field search, bilingual use and private access rather than a public-facing product catalogue.",
    solution:
      "A private dealership management application covering customers, vehicles, cash and loan sales, supporting documents, record search, export and Arabic / English operation.",
    statusNote:
      "This is a private business application. No public deployment or application entry is linked from the portfolio.",
  },
  {
    index: "06",
    slug: "independent-delivery-management-platform",
    title: "Independent Delivery Management Platform",
    shortTitle: "Delivery Management Platform",
    shortDescription:
      "A standalone operational delivery system designed to work independently today while remaining ready for deferred SAP synchronization.",
    category: "Enterprise Systems",
    projectType: "Private Enterprise Platform · System Architecture",
    status: "Private Platform / Case Study",
    statusKind: "private",
    featured: true,
    role: "System architecture · Product design · Integration strategy",
    technologies: ["PostgreSQL", "Mobile application", "Operations dashboard", "WATI / WhatsApp", "Event outbox", "SAP-ready architecture"],
    capabilities: [
      "Orders and customers",
      "Drivers and routes",
      "Deliveries",
      "Coupon ledger",
      "Mobile application",
      "Operations dashboard",
      "WhatsApp / WATI integration",
      "Deferred SAP synchronization",
    ],
    conceptAsset: "/projects/delivery-platform-concept.webp",
    conceptAlt: "Concept visual of a delivery dispatch desk with route planning and mobile operations",
    visual: "delivery",
    challenge:
      "Support day-to-day delivery operations independently without closing the door on future SAP integration.",
    approach:
      "Separate operational workflows from ERP dependency and use an event / outbox pattern so confirmed business events can synchronize later without blocking current operations.",
    solution:
      "A PostgreSQL-backed delivery platform spanning orders, customers, drivers, routes, delivery execution, coupon ledger, mobile operations, dashboard control and WhatsApp / WATI communication.",
    statusNote:
      "This is a private enterprise platform and architecture case study. No public deployment is claimed.",
  },
  {
    index: "07",
    slug: "active-directory-cybersecurity-hardening",
    title: "Active Directory & Cybersecurity Hardening",
    shortTitle: "Cybersecurity Hardening",
    shortDescription:
      "A staged enterprise security program strengthening identity, endpoints, applications, devices and audit controls.",
    category: "Cybersecurity",
    projectType: "Cybersecurity · Identity · Endpoint Hardening",
    status: "Enterprise IT Program",
    statusKind: "program",
    featured: false,
    role: "Security architecture · Staged deployment · Testing",
    technologies: ["Active Directory", "GPO", "LAPS", "AppLocker", "Microsoft Defender", "ASR rules", "Windows Firewall"],
    capabilities: [
      "Password and lockout policies",
      "Local administrator restrictions",
      "USB controls",
      "PowerShell and CMD restrictions",
      "Audit policies",
      "Endpoint hardening",
      "Staged testing and deployment",
    ],
    conceptAsset: "/projects/cybersecurity-concept.webp",
    conceptAlt: "Concept visual of an enterprise cybersecurity operations workspace",
    visual: "security",
    challenge:
      "Reduce identity and endpoint risk without introducing uncontrolled policy changes into an operating enterprise environment.",
    approach:
      "Build layered controls through Group Policy and endpoint security, then stage, test and expand enforcement deliberately.",
    solution:
      "A hardening program covering password and account-lockout policy, administrator controls, LAPS, AppLocker, Defender and ASR, firewall policy, USB restrictions, shell controls and audit configuration.",
    statusNote:
      "This is an internal enterprise cybersecurity program, not a public product.",
  },
  {
    index: "08",
    slug: "hrms-attendance-platform",
    title: "HRMS & Attendance Platform",
    shortTitle: "HRMS & Attendance",
    shortDescription:
      "A business operations platform joining employee records, biometric attendance, shift rules and HR reporting.",
    category: "Enterprise Systems",
    projectType: "Business Operations Platform · HRMS · Integration",
    status: "Internal System",
    statusKind: "private",
    featured: false,
    role: "Business logic · Integration architecture · Dashboards",
    technologies: ["Hikvision", "ZKTeco BioTime", "Database integrations", "Shift logic", "HR dashboards"],
    capabilities: [
      "Employee management",
      "Attendance integration",
      "Organization structure",
      "Shift logic",
      "Overtime rules",
      "Late and absence calculations",
      "HR dashboards",
    ],
    conceptAsset: "/projects/hrms-attendance-concept.webp",
    conceptAlt: "Concept visual of biometric attendance hardware and an HR operations dashboard",
    visual: "hrms",
    challenge:
      "Turn biometric events and HR rules into dependable attendance calculations and operational visibility.",
    approach:
      "Connect device and attendance data to employee structure, shift rules and calculation logic rather than treating clock records as isolated data.",
    solution:
      "An HRMS and attendance platform integrating employee management, Hikvision and ZKTeco BioTime data, database connections, shifts, overtime, late / absence calculations and HR dashboards.",
    statusNote:
      "This is an internal business operations system. No public deployment is claimed.",
  },
  {
    index: "09",
    slug: "sahaba-water",
    title: "Sahaba Water",
    shortTitle: "Sahaba Water",
    shortDescription:
      "A polished bilingual storefront balancing atmospheric brand design with practical product, cart and account journeys.",
    category: "Web",
    projectType: "Public Website · Bilingual Commerce",
    status: "Live Product",
    statusKind: "live",
    featured: false,
    role: "Web design · Frontend development · Commerce UX",
    technologies: ["React", "Product catalogue", "Cart flows", "Google Identity", "Arabic / English"],
    capabilities: ["Product catalogue", "Quantity controls", "Cart", "Customer access", "Responsive commerce", "Bilingual UI"],
    liveUrl: "https://sahaba-frontend.vercel.app/",
    coverAsset: "/projects/sahaba.png",
    coverAlt: "Sahaba Water public ecommerce website",
    visual: "browser",
    challenge:
      "Give a local water brand a polished, low-friction path from product discovery to cart across languages and devices.",
    approach:
      "Combine premium brand presentation with practical catalogue, quantity, cart and account interactions.",
    solution:
      "A responsive React commerce experience with a product collection, cart controls, account access, Google identity integration and Arabic / English support.",
    statusNote: "This product has a publicly accessible live deployment.",
  },
  {
    index: "10",
    slug: "alrawdah-public-commerce-website",
    title: "Alrawdah Springs Public Commerce Website",
    shortTitle: "Alrawdah Springs Web",
    shortDescription:
      "A high-contrast multilingual commerce experience shaped around product storytelling, buying journeys and UAE-wide delivery.",
    category: "Web",
    projectType: "Public Website · Commerce · SEO",
    status: "Public Website",
    statusKind: "live",
    featured: false,
    role: "Web design · Commerce UX · Technical SEO · Conversion",
    technologies: ["Custom commerce", "Cloudflare", "Technical SEO", "Structured data", "Consent-managed analytics"],
    capabilities: ["Catalogue and cart", "Customer accounts", "Order tracking", "Regional landing pages", "Arabic / English", "Performance and conversion"],
    liveUrl: "https://rswater.ae/",
    coverAsset: "/projects/rs-water.png",
    coverAlt: "Alrawdah Springs public commerce website",
    visual: "browser",
    challenge:
      "Unify commerce, delivery coverage, customer information and brand content in a public platform designed for UAE audiences.",
    approach:
      "Build the web experience around discoverability, buying journeys, multilingual access, performance and clear regional delivery information.",
    solution:
      "A public commerce platform with catalogue and cart, account and order flows, delivery content, regional landing pages, consent-aware analytics and technical SEO architecture.",
    statusNote: "This website has a publicly accessible live deployment.",
  },
  {
    index: "11",
    slug: "website-seo-transformation",
    title: "Website & SEO Transformation",
    shortTitle: "Web & SEO Transformation",
    shortDescription:
      "A web transformation practice combining technical SEO, structured data, content architecture, performance and conversion-minded brand platforms.",
    category: "Web",
    projectType: "Web Strategy · SEO · Brand Platform",
    status: "Client Work / Case Study",
    statusKind: "case-study",
    featured: false,
    role: "Web strategy · SEO · Performance",
    technologies: ["Technical SEO", "Structured data", "Content architecture", "Performance", "Multilingual UX", "Conversion optimization"],
    capabilities: [
      "Alrawdah Springs website",
      "AR Green corporate website",
      "SEO strategy",
      "Technical SEO",
      "Structured data",
      "Content architecture",
      "Performance",
      "Brand positioning",
    ],
    conceptAsset: "/projects/seo-transformation-concept.webp",
    conceptAlt: "Concept visual of a web design and technical SEO performance workstation",
    visual: "seo",
    challenge:
      "Make corporate and commerce websites easier to discover, faster to use and clearer about the businesses they represent.",
    approach:
      "Combine technical foundations, content structure, search intent, multilingual experience and conversion paths rather than treating SEO as a separate publishing task.",
    solution:
      "Website and SEO transformation work spanning Alrawdah Springs, AR Green and related digital experiences, including technical SEO, structured data, content architecture, performance and brand positioning.",
    statusNote:
      "This entry represents a body of client and transformation work. Only the public URLs already identified elsewhere are linked.",
  },
  {
    index: "12",
    slug: "kifaya-streetwear-storefront",
    title: "Kifaya — Arab Y2K Streetwear Storefront",
    shortTitle: "Kifaya",
    shortDescription:
      "A headless e-commerce storefront for an Arab Y2K streetwear label, built on the Shopify Storefront API with a motion-led React interface.",
    category: "Web",
    projectType: "E-commerce Storefront · Headless Shopify",
    status: "Build / Case Study",
    statusKind: "case-study",
    featured: false,
    role: "Storefront design · Front-end development",
    technologies: ["Shopify Storefront API", "React", "React Router", "Framer Motion", "Zustand", "Tailwind CSS"],
    capabilities: [
      "Headless Shopify storefront",
      "Storefront API data layer",
      "Routed React storefront",
      "Framer Motion interactions",
      "Zustand client state",
      "Tailwind styling system",
    ],
    visual: "storefront",
    challenge:
      "Give an Arab Y2K streetwear label a storefront with a distinct visual attitude while keeping products and commerce data managed in Shopify.",
    approach:
      "Separate presentation from commerce: Shopify stays the commerce backend through its Storefront API, while a custom React front end owns layout, routing, motion and state.",
    solution:
      "A headless storefront built with React, React Router, Framer Motion, Zustand and Tailwind CSS on top of the Shopify Storefront API.",
    statusNote:
      "This is a build presented as a case study. No public deployment is linked from the portfolio.",
  },
  {
    index: "13",
    slug: "revana-bottled-water-website",
    title: "Revana — Premium Bottled Water Website",
    shortTitle: "Revana",
    shortDescription:
      "A multi-page website for a premium still and sparkling bottled-water brand, built around a black, white and silver system, motion and 3D.",
    category: "Web",
    projectType: "Brand Website · Motion Design · 3D",
    status: "Build / Case Study",
    statusKind: "case-study",
    featured: false,
    role: "Visual system · Motion · Front-end development",
    technologies: ["Next.js", "React Three Fiber", "drei", "Motion design", "Arabic font support"],
    capabilities: [
      "Multi-page brand website",
      "Still and sparkling product story",
      "Black / white / silver visual system",
      "Motion design",
      "3D scenes with React Three Fiber and drei",
      "Arabic font support",
    ],
    visual: "brand-3d",
    challenge:
      "Present a premium still and sparkling bottled-water brand with the restraint and finish expected of a premium product.",
    approach:
      "Hold the whole site to a strict black, white and silver palette, and let motion and real-time 3D carry the product rather than decoration.",
    solution:
      "A multi-page Next.js website with a monochrome visual system, motion design, 3D product scenes built with React Three Fiber and drei, and Arabic font support.",
    statusNote:
      "This is a build presented as a case study. No public deployment is linked from the portfolio.",
  },
  {
    index: "14",
    slug: "company-ticket-system",
    title: "Company Ticket System",
    shortTitle: "Ticket System",
    shortDescription:
      "An internal ticketing system for IT support, delivery issues and employee requests, with role-based access, assignment and reporting.",
    category: "Enterprise Systems",
    projectType: "Internal Tool · Service Desk · Full-stack",
    status: "Internal Tool",
    statusKind: "private",
    featured: false,
    role: "Full-stack development · Access control · Reporting",
    technologies: ["React", "Vite", "Node.js", "Express", "MySQL 8", "JWT", "Docker Compose"],
    capabilities: [
      "IT support tickets",
      "Delivery issue tickets",
      "Employee requests",
      "JWT role-based authentication",
      "Departments and priorities",
      "Comments and attachments",
      "Ticket assignment",
      "Admin dashboard and reporting",
    ],
    visual: "tickets",
    challenge:
      "Bring IT support, delivery issues and employee requests into one tracked queue instead of scattered messages.",
    approach:
      "Model tickets around departments, priorities and assignment, and protect every action with role-based access.",
    solution:
      "A React and Vite front end with a Node / Express API and MySQL 8, JWT role-based authentication, departments, priorities, comments, attachments, assignment and an admin dashboard with reporting, packaged with Docker Compose.",
    statusNote:
      "This is an internal tool. No public deployment is claimed.",
  },
  {
    index: "15",
    slug: "bottle-tracking-system",
    title: "Bottle Tracking System",
    shortTitle: "Bottle Tracking",
    shortDescription:
      "A desktop application that tracks water-bottle inventory and movements, with charts for day-to-day visibility.",
    category: "Enterprise Systems",
    projectType: "Desktop Application · Inventory · Internal Tool",
    status: "Internal Tool",
    statusKind: "private",
    featured: false,
    role: "Desktop application development · Data visualisation",
    technologies: ["Electron", "React", "Supabase", "Recharts"],
    capabilities: [
      "Bottle inventory tracking",
      "Bottle movement records",
      "Desktop application",
      "Supabase data layer",
      "Recharts dashboards",
    ],
    visual: "desktop",
    challenge:
      "Keep an accurate picture of water-bottle inventory and where bottles move.",
    approach:
      "Ship it as a focused desktop application backed by a hosted database, with charts that make movement visible at a glance.",
    solution:
      "An Electron desktop application built with React and Supabase that records bottle inventory and movements and visualises them with Recharts.",
    statusNote:
      "This is an internal tool. No public deployment is claimed.",
  },
  {
    index: "16",
    slug: "delivery-operations-dispatch-console",
    title: "Delivery Operations Dispatch Console",
    shortTitle: "Dispatch Console",
    shortDescription:
      "A UAE-wide dispatcher workspace for order ingestion, geofenced driver zones, time-window route optimisation and live map overlays.",
    category: "Enterprise Systems",
    projectType: "Operations Software · Geospatial · Route Optimisation",
    status: "Build / Case Study",
    statusKind: "case-study",
    featured: false,
    role: "Full-stack development · Geospatial data · Optimisation",
    technologies: ["Next.js", "MapLibre GL", "FastAPI", "PostgreSQL", "PostGIS", "OR-Tools"],
    capabilities: [
      "Order ingestion",
      "Geofenced driver zones",
      "Route optimisation with time windows",
      "Street-following route overlays",
      "Customer location pins",
      "UAE-wide coverage",
    ],
    visual: "dispatch",
    challenge:
      "Give dispatchers one workspace to take in orders and plan routes across the UAE.",
    approach:
      "Treat location as first-class data: geofenced driver zones and customer pins in PostGIS, route optimisation with time windows in OR-Tools, and a MapLibre map as the working surface.",
    solution:
      "A Next.js and MapLibre GL console on a FastAPI and PostgreSQL / PostGIS backend covering order ingestion, geofenced driver zones, OR-Tools route optimisation with time windows, street-following route overlays and customer location pins.",
    statusNote:
      "This is a build presented as a case study. No public deployment is claimed.",
  },
  {
    index: "17",
    slug: "gamerhub-uae",
    title: "GamerHub UAE",
    shortTitle: "GamerHub UAE",
    shortDescription:
      "A bilingual full-stack social gaming platform with discovery, squads, matchmaking, a feed, notifications and realtime chat.",
    category: "Products",
    projectType: "Social Platform · Realtime · Full-stack",
    status: "Build / Case Study",
    statusKind: "case-study",
    featured: false,
    role: "Full-stack development · Realtime · API design",
    technologies: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "Socket.io", "JWT", "Zod"],
    capabilities: [
      "Player and game discovery",
      "Squads",
      "Matchmaking",
      "Activity feed",
      "Notifications",
      "Realtime chat",
      "Bilingual interface",
      "Validation and rate limiting",
    ],
    visual: "social",
    challenge:
      "Give players in the UAE one bilingual place to discover each other, form squads and talk in real time.",
    approach:
      "Pair a REST API for the social graph with Socket.io for realtime chat, and validate and rate-limit every entry point.",
    solution:
      "A React, Vite and Tailwind front end with a Node / Express and PostgreSQL backend, Socket.io realtime chat, JWT authentication, Zod validation and rate limiting, covering discovery, squads, matchmaking, feed and notifications.",
    statusNote:
      "This is a build presented as a case study. No public deployment is claimed.",
  },
];

export type LabExperiment = {
  slug: string;
  title: string;
  summary: string;
  technologies: string[];
  note: string;
};

/** Experiments live in the Lab, not in the case-study index. */
export const labExperiments: LabExperiment[] = [
  {
    slug: "trading-terminal-experiment",
    title: "Real-time trading terminal",
    summary:
      "A real-time trading interface on the Binance WebSocket API, charted with TradingView Lightweight Charts, with a built-in assistant that computes RSI, trend and momentum on the live data.",
    technologies: ["Binance WebSocket API", "TradingView Lightweight Charts", "RSI · trend · momentum"],
    note: "Interface experiment · not a financial product",
  },
];

const featuredProjectOrder = [
  "alrawdah-digital-commerce-platform",
  "alrawdah-public-commerce-website",
  "infrastructure-disaster-recovery-transformation",
  "falcon-crm",
  "haak-solutions",
  "independent-delivery-management-platform",
];

export const featuredProjects = featuredProjectOrder
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is Project => Boolean(project));

export const getProject = (slug: string) => projects.find((project) => project.slug === slug);

/** Intrinsic sizes of the raster assets, so every image reserves its space (no layout shift). */
export const imageSizes: Record<string, { width: number; height: number }> = {
  "/projects/rs-water.png": { width: 1272, height: 716 },
  "/projects/haak.png": { width: 1265, height: 712 },
  "/projects/sahaba.png": { width: 1265, height: 712 },
  "/projects/alrawdah-platform-concept.webp": { width: 760, height: 505 },
  "/projects/infrastructure-concept.webp": { width: 760, height: 505 },
  "/projects/sap-systems-concept.webp": { width: 760, height: 505 },
  "/projects/falcon-crm-concept.webp": { width: 760, height: 505 },
  "/projects/delivery-platform-concept.webp": { width: 760, height: 505 },
  "/projects/cybersecurity-concept.webp": { width: 760, height: 505 },
  "/projects/hrms-attendance-concept.webp": { width: 760, height: 505 },
  "/projects/seo-transformation-concept.webp": { width: 760, height: 505 },
};

export const projectCategories: Array<"All" | ProjectCategory> = [
  "All",
  "Products",
  "Enterprise Systems",
  "Infrastructure",
  "Cybersecurity",
  "ERP / SAP",
  "Web",
];
