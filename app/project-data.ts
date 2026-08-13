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
  | "seo";

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
      "A software and IT solutions practice spanning products, enterprise systems, web applications and premium digital experiences.",
    category: "Products",
    projectType: "Software Products · IT Solutions · Digital Transformation",
    status: "Public Website / Solutions Practice",
    statusKind: "live",
    featured: true,
    role: "Software products · Digital experience · IT solutions",
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
      "A bilingual direct-to-consumer storefront with product discovery, quantities, cart flows and customer account access.",
    category: "Web",
    projectType: "Public Website · Bilingual Commerce",
    status: "Live Product",
    statusKind: "live",
    featured: false,
    role: "Frontend development · Commerce UX",
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
      "A multilingual commerce and content platform supporting products, accounts, delivery information, order journeys and regional discovery.",
    category: "Web",
    projectType: "Public Website · Commerce · SEO",
    status: "Public Website",
    statusKind: "live",
    featured: false,
    role: "Web platform · Technical SEO · Conversion",
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
];

export const featuredProjects = projects.filter((project) => project.featured);

export const projectCategories: Array<"All" | ProjectCategory> = [
  "All",
  "Products",
  "Enterprise Systems",
  "Infrastructure",
  "Cybersecurity",
  "ERP / SAP",
  "Web",
];
