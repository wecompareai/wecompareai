import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

const DISALLOW_PRIVATE = ["/api/", "/admin/", "/profile/", "/_next/", "/blog/new", "/blog/*/edit"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW_PRIVATE,
      },
      // ── Google ────────────────────────────────────────────────────────────
      { userAgent: "Googlebot",       allow: "/" },
      { userAgent: "Googlebot-Image", allow: "/" },
      { userAgent: "Googlebot-Video", allow: "/" },
      // ── Bing / Microsoft ─────────────────────────────────────────────────
      { userAgent: "Bingbot",         allow: "/" },
      { userAgent: "msnbot",          allow: "/" },
      // ── OpenAI / ChatGPT ─────────────────────────────────────────────────
      { userAgent: "GPTBot",          allow: "/", disallow: ["/api/", "/admin/"] },
      { userAgent: "ChatGPT-User",    allow: "/", disallow: ["/api/", "/admin/"] },
      { userAgent: "OAI-SearchBot",   allow: "/", disallow: ["/api/", "/admin/"] },
      // ── Anthropic / Claude ────────────────────────────────────────────────
      { userAgent: "ClaudeBot",       allow: "/", disallow: ["/api/", "/admin/"] },
      { userAgent: "anthropic-ai",    allow: "/", disallow: ["/api/", "/admin/"] },
      // ── Google AI / Gemini ────────────────────────────────────────────────
      { userAgent: "Google-Extended", allow: "/", disallow: ["/api/", "/admin/"] },
      // ── Perplexity ────────────────────────────────────────────────────────
      { userAgent: "PerplexityBot",   allow: "/", disallow: ["/api/", "/admin/"] },
      // ── Meta AI ───────────────────────────────────────────────────────────
      { userAgent: "FacebookBot",     allow: "/", disallow: ["/api/", "/admin/"] },
      { userAgent: "meta-externalagent", allow: "/", disallow: ["/api/", "/admin/"] },
      // ── Apple ─────────────────────────────────────────────────────────────
      { userAgent: "Applebot",        allow: "/", disallow: ["/api/", "/admin/"] },
      // ── Cohere ────────────────────────────────────────────────────────────
      { userAgent: "cohere-ai",       allow: "/", disallow: ["/api/", "/admin/"] },
      // ── Common Crawl (feeds many LLM training sets) ───────────────────────
      { userAgent: "CCBot",           allow: "/", disallow: ["/api/", "/admin/"] },
      // ── You.com ───────────────────────────────────────────────────────────
      { userAgent: "YouBot",          allow: "/", disallow: ["/api/", "/admin/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
