import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/services", destination: "/expertise", permanent: true },
      { source: "/about", destination: "/company", permanent: true },
    ];
  },
  images: {
    localPatterns: [
      // All local images without a query string (projects, case studies, logos).
      { pathname: "/images/**", search: "" },
      // Cache-busting query strings on logo assets.
      // Keep `search` in sync with the VERSION constant in src/components/ui/Logo.tsx.
      { pathname: "/images/sagesix-logo-color.png", search: "?v=2" },
      { pathname: "/images/sagesix-logo-white.png", search: "?v=2" },
      { pathname: "/images/sagesix-icon.png", search: "?v=2" },
    ],
  },
};

export default nextConfig;