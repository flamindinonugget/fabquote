import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/calculators/print-cost",
        destination: "/3d-print-cost-calculator",
        permanent: true,
      },
      {
        source: "/calculators/filament-usage",
        destination: "/filament-usage-calculator",
        permanent: true,
      },
      {
        source: "/calculators/electricity-cost",
        destination: "/electricity-cost-calculator",
        permanent: true,
      },
      {
        source: "/calculators/profit-margin",
        destination: "/profit-margin-calculator",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/terms-of-service",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
