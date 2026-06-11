export const siteConfig = {
  name: "FabQuote",
  url: "https://fabquote.app",
  description:
    "Instant STL quoting and free 3D printing calculators for small print businesses.",
  email: "hello@fabquote.app",
};

export const calculatorPages = [
  {
    title: "AI STL Quote Generator",
    description:
      "Upload an STL, estimate material and print costs, and generate a professional 3D print quote.",
    href: "/stl-quote-generator",
    accent: "brand" as const,
  },
  {
    title: "3D Print Cost Calculator",
    description:
      "Calculate filament cost, electricity cost, base cost, suggested selling price, and profit for a 3D print.",
    href: "/3d-print-cost-calculator",
    accent: "brand" as const,
  },
  {
    title: "Filament Usage Calculator",
    description:
      "Estimate how many 3D prints fit on a filament spool and the filament cost per print.",
    href: "/filament-usage-calculator",
    accent: "mint" as const,
  },
  {
    title: "Electricity Cost Calculator",
    description:
      "Calculate electricity cost per 3D print from printer wattage, print time, and local kWh rate.",
    href: "/electricity-cost-calculator",
    accent: "amber" as const,
  },
  {
    title: "Profit Margin Calculator",
    description:
      "Calculate net profit and profit margin for a 3D print sale after material, electricity, fees, and shipping.",
    href: "/profit-margin-calculator",
    accent: "coral" as const,
  },
];

export const staticPages = [
  {
    title: "Pricing",
    description:
      "Compare FabQuote plans for STL quote limits, branded quotes, saved customers, and shop request forms.",
    href: "/pricing",
  },
  {
    title: "Dashboard",
    description:
      "Review recent FabQuote customers, projects, and quotes stored locally in this browser.",
    href: "/dashboard",
  },
  {
    title: "Dashboard Analytics",
    description:
      "Analyze saved FabQuote quotes with local revenue, markup, profit, material, machine, and customer intelligence.",
    href: "/dashboard/analytics",
  },
  {
    title: "Customers",
    description:
      "Manage FabQuote customers locally with contact details, notes, search, sorting, and delete confirmation.",
    href: "/customers",
  },
  {
    title: "Projects",
    description:
      "Manage FabQuote projects locally with customer links, STL file names, materials, and notes.",
    href: "/projects",
  },
  {
    title: "Machines",
    description:
      "Manage FabQuote machine profiles with printer presets, speed, wattage, layer height, nozzle, markup, and labor defaults.",
    href: "/machines",
  },
  {
    title: "Quote Test Lab",
    description:
      "Validate FabQuote Profit Protection warnings and confidence scores with built-in local quote scenarios.",
    href: "/quote-test-lab",
  },
  {
    title: "Feedback Admin",
    description:
      "Review locally stored FabQuote Early Access feedback submissions, workflow pain points, ratings, and JSON export.",
    href: "/feedback-admin",
  },
  {
    title: "Quotes",
    description:
      "Manage FabQuote quote records locally with search, sorting, deletion, and duplication.",
    href: "/quotes",
  },
  {
    title: "About",
    description:
      "Learn what FabQuote provides for 3D printing cost planning and quoting workflows.",
    href: "/about",
  },
  {
    title: "Contact",
    description:
      "Contact FabQuote with calculator feedback, support questions, and partnership notes.",
    href: "/contact",
  },
  {
    title: "Privacy Policy",
    description:
      "Read the FabQuote privacy policy for this 3D printing quoting website.",
    href: "/privacy-policy",
  },
  {
    title: "Terms of Service",
    description:
      "Read the terms that apply when using FabQuote calculators and website content.",
    href: "/terms-of-service",
  },
];

export const sitemapPages = [
  { href: "", priority: 1, changeFrequency: "weekly" as const },
  ...calculatorPages.map((page) => ({
    href: page.href,
    priority: page.href === "/stl-quote-generator" ? 0.95 : 0.85,
    changeFrequency: page.href === "/stl-quote-generator" ? "weekly" as const : "monthly" as const,
  })),
  ...staticPages.map((page) => ({
    href: page.href,
    priority: page.href === "/about" || page.href === "/contact" ? 0.7 : 0.35,
    changeFrequency: "yearly" as const,
  })),
];
