import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Product URLs that changed when the catalogue was aligned with the official product list.
  redirects() {
    const renamed: Record<string, string> = {
      "aluminium-chloride-anhydrous": "aluminium-chloride-granules",
      "calcium-chloride": "calcium-chloride-granules",
      "soda-ash-dense-light": "soda-ash-light",
    };
    const discontinued = ["caustic-soda-lye", "stable-bleaching-powder", "phosphoric-acid", "hydrogen-peroxide", "poly-aluminium-chloride", "liquid-chlorine", "acetic-acid-glacial", "caustic-potash-flakes-lye"];
    return [
      ...Object.entries(renamed).map(([from, to]) => ({ source: `/products/${from}`, destination: `/products/${to}`, permanent: true })),
      ...discontinued.map((slug) => ({ source: `/products/${slug}`, destination: "/products", permanent: false })),
    ];
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
