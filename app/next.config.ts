import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const appDir = path.dirname(fileURLToPath(import.meta.url));
const wsStub = path.join(appDir, "src/lib/stubs/ws.ts");

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      ws: wsStub,
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias = { ...config.resolve.alias, ws: wsStub };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/:routeSlug/snapshot',
        destination: '/check?route=:routeSlug',
        permanent: true,
      },
      {
        source: '/case/:caseId/snapshot',
        destination: '/check/result/:caseId',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

initOpenNextCloudflareForDev();
