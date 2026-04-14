import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/auth/SessionProvider";
import CookieBanner from "@/components/CookieBanner";
import ChatBot from "@/components/ChatBot";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "We Compare AI — The Most Accurate AI Model & Pricing Comparison Platform",
    template: "%s | We Compare AI",
  },
  description:
    "The most accurate AI model & pricing comparison platform. Real-time benchmarks, token costs, and unbiased comparisons across OpenAI, Anthropic, Google & more. Trusted by developers, startups & AI teams.",
  keywords: [
    "compare AI",
    "AI comparison",
    "AI compare",
    "compare AI models",
    "AI models comparison",
    "LLM comparison",
    "best AI model 2026",
    "ChatGPT vs Claude",
    "GPT-4o vs Claude Opus 4",
    "GPT-4o vs Gemini",
    "compare large language models",
    "AI platforms comparison",
    "AI coding tools comparison",
    "best AI for coding",
    "best AI image generator 2026",
    "best AI music generator",
    "Suno vs Udio",
    "AI audio comparison",
    "ElevenLabs vs OpenAI TTS",
    "AI voice cloning tools",
    "AI cloud providers comparison",
    "AI chip comparison",
    "GPU comparison AI",
    "AI security tools",
    "compare AI tools",
    "AI pricing comparison",
    "best open source LLM",
    "ChatGPT alternatives",
    "AI infrastructure comparison",
    "AI tool feature matrix",
    "side by side AI comparison",
    "which AI is best",
  ],
  authors: [
    { name: "Jigar Acharya" },
    { name: "Saurabh Gera" },
  ],
  creator: "AI Compare",
  publisher: "AI Compare",
  category: "Technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "We Compare AI",
    title: "We Compare AI — The Most Accurate AI Model & Pricing Comparison Platform",
    description:
      "The most accurate AI model & pricing comparison platform. Real-time benchmarks, token costs, and unbiased comparisons across OpenAI, Anthropic, Google & more.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Compare — Compare AI Technologies Side by Side",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "We Compare AI — The Most Accurate AI Model & Pricing Comparison Platform",
    description:
      "Real-time benchmarks, token costs, and unbiased comparisons across OpenAI, Anthropic, Google & more. Trusted by developers, startups & AI teams.",
    images: ["/og-image.png"],
    creator: "@aicomparedev",
    site: "@aicomparedev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "a2bae11a313e7ebf",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "47E2DDFDD1BFF9E586130F9380A94FFE",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "We Compare AI",
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/categories?q={search_term_string}` },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "We Compare AI",
              url: SITE_URL,
              logo: `${SITE_URL}/logo-light.svg`,
              sameAs: [
                "https://twitter.com/aicomparedev",
                "https://github.com/Jigaracharya/AI-Compare",
              ],
              description: "The most comprehensive independent AI comparison platform. 100+ AI tools tracked across 1,000+ data points. Updated in real-time by AI agents.",
              founder: [
                { "@type": "Person", name: "Jigar Acharya", jobTitle: "Solution Architect" },
                { "@type": "Person", name: "Saurabh Gera",  jobTitle: "Infrastructure Architect & Director" },
              ],
              knowsAbout: [
                "Artificial Intelligence", "Large Language Models", "AI Comparison",
                "ChatGPT", "Claude", "Gemini", "AI Compliance", "HIPAA AI", "GDPR AI",
              ],
            }),
          }}
        />
        <SessionProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieBanner />
          <ChatBot />
        </SessionProvider>
      </body>
    </html>
  );
}
