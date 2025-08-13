import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  distDir: '.next',
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: [
      '@musetrip360/auth-system',
      '@musetrip360/user-management',
      '@musetrip360/museum-management',
      '@musetrip360/artifact-management',
      '@musetrip360/event-management',
      '@musetrip360/ui-core',
      '@musetrip360/query-foundation',
      '@musetrip360/infras',
      '@musetrip360/virtual-tour',
      '@musetrip360/streaming',
    ],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
