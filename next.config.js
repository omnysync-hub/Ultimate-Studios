/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  transpilePackages: ["next-sanity", "sanity", "@sanity/vision", "styled-components"],
  experimental: {
    optimizePackageImports: ["gsap", "swiper", "next-sanity"],
    optimizeCss: true,
    cssChunking: "strict"
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**"
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**"
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**"
      }
    ]
  },
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
    ];

    const siteCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://www.googlesyndication.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://i.ytimg.com https://img.youtube.com https://cdn.sanity.io https://*.googlesyndication.com https://*.googleusercontent.com https://www.google-analytics.com https://www.googletagmanager.com",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://www.googlesyndication.com https://googleads.g.doubleclick.net https://www.google.com https://www.youtube.com https://youtube.com https://vitals.vercel-insights.com https://*.api.sanity.io https://*.sanity.io https://api.resend.com",
      "media-src 'self' https://storage.googleapis.com",
      "frame-src https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join("; ");

    // Studio needs Sanity CDN + Google OAuth popups (COOP allow-popups).
    const studioCsp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://core.sanity-cdn.com https://*.sanity.io",
      "style-src 'self' 'unsafe-inline' https://core.sanity-cdn.com",
      "img-src 'self' data: blob: https://cdn.sanity.io https://*.sanity.io https://*.googleusercontent.com",
      "font-src 'self' data: https://core.sanity-cdn.com",
      "connect-src 'self' https://*.api.sanity.io https://*.sanity.io https://core.sanity-cdn.com https://cdn.sanity.io",
      "media-src 'self' blob:",
      "frame-src 'self' https://*.sanity.io https://accounts.google.com https://www.google.com",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://*.sanity.io",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests"
    ].join("; ");

    return [
      {
        source: "/studio/:path*",
        headers: [
          { key: "Content-Security-Policy", value: studioCsp },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Cross-Origin-Resource-Policy", value: "cross-origin" },
          ...security
        ]
      },
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: siteCsp },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-site" },
          { key: "X-Frame-Options", value: "DENY" },
          ...security
        ]
      }
    ];
  }
};

module.exports = nextConfig;

// Cloudflare Workers local bindings when @opennextjs/cloudflare is present.
try {
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare");
  initOpenNextCloudflareForDev();
} catch {
  // Local Vercel/Next-only installs without the Cloudflare adapter.
}
