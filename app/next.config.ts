import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
