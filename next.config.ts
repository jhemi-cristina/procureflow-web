import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        // CSS Modules ficam de fora: com `as: "*.css"` eles virariam CSS global
        // e os nomes de classe importados nos componentes ficariam `undefined`.
        condition: {
          all: [{ not: "foreign" }, { not: { path: /\.module\.css$/ } }],
        },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
