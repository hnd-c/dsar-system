import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image domains for Supabase storage
  images: {
    domains: [
      'localhost',
      'vieplavzqscxnmxngiat.supabase.co',  // Your Supabase project domain
    ],
  },
  // Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // Configure webpack if needed
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'sharp'];
    return config;
  },
};

export default nextConfig;
