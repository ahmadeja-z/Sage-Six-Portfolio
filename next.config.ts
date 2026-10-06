import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/services", destination: "/expertise", permanent: true },
      { source: "/about", destination: "/company", permanent: true },
    ];
  },
  images: {
    minimumCacheTTL: 31536000,
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
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;