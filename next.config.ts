import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  cacheMaxMemorySize: 0,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevent clickjacking — signals trust to Google
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Prevent MIME sniffing — Core Web Vitals trust signal
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Control referrer info sent to third parties
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Limit browser features (improves security score)
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Force HTTPS — required for good Core Web Vitals score
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Basic XSS protection for older browsers
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
      {
        // Long-term cache for static assets — improves page speed score
        source: "/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Cache _next static chunks for 1 year
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
