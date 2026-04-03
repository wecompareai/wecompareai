import { Metadata } from "next";
import FeaturesPage from "@/components/FeaturesPage";
import featuresData from "../../../data/ai-features.json";
import { auth } from "@/lib/auth";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "AI Tools Feature Comparison Matrix — GPT-4o vs Claude vs Gemini & More",
  description:
    "Side-by-side AI feature matrix of 15+ AI tools: GPT-4o, Claude 3.5, Gemini, ElevenLabs, Suno, Udio, MusicGen, Stable Audio and more. Compare image generation, video, audio, music, code, testing, databases, and reporting capabilities in one place.",
  keywords: [
    "AI features comparison",
    "compare AI tools",
    "AI comparison matrix",
    "GPT-4o vs Claude Opus 4 features",
    "GPT-4o vs Gemini",
    "best AI music generator",
    "Suno vs Udio comparison",
    "ElevenLabs vs OpenAI TTS",
    "AI image generation comparison",
    "AI coding assistant comparison",
    "best AI for voice cloning",
    "MusicGen vs Stable Audio",
    "AI tool feature matrix 2026",
    "compare AI tools by feature",
    "AI audio generation comparison",
    "side by side AI comparison",
  ],
  alternates: { canonical: `${SITE_URL}/features` },
  openGraph: {
    title: "AI Tools Feature Comparison Matrix | AI Compare",
    description:
      "Compare 15+ AI tools side by side: GPT-4o vs Claude vs Gemini vs Suno vs ElevenLabs — across image, video, audio, music, code, and 5 more categories.",
    url: `${SITE_URL}/features`,
    siteName: "AI Compare",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Tools Feature Comparison Matrix" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "AI Tools Feature Comparison Matrix | AI Compare",
    description: "Compare 15+ AI tools side by side across image, video, audio, music, code, and more.",
    images: ["/og-image.png"],
  },
};

function FeaturesJsonLd() {
  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "AI Tools & Features Comparison Matrix",
    description:
      "Comprehensive side-by-side comparison of 15+ AI tools across 9 capability categories: image generation, video generation, audio (TTS/STT/voice cloning), music generation, content, code, software testing, database plugins, and reporting platforms.",
    url: `${SITE_URL}/features`,
    creator: {
      "@type": "Organization",
      name: "AI Compare",
      url: SITE_URL,
    },
    dateModified: featuresData.lastUpdated,
    keywords: [
      "AI comparison",
      "LLM features",
      "AI music generation",
      "AI audio tools",
      "image generation AI",
      "coding assistants",
    ],
    variableMeasured: [
      "Image Generation",
      "Video Generation",
      "Audio (TTS/STT/Voice Cloning)",
      "Music Generation",
      "Content & Writing",
      "Code & Development",
      "Software Testing",
      "Database Plugins",
      "Reporting Platforms",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetJsonLd) }}
    />
  );
}

export default async function Page() {
  const session = await auth();
  const canAdd = session?.user?.role === "admin" || session?.user?.role === "contributor";

  return (
    <>
      <FeaturesJsonLd />
      {canAdd && (
        <div className="max-w-7xl mx-auto px-4 pt-6 flex justify-end">
          <Link
            href="/admin/features/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Feature Tool
          </Link>
        </div>
      )}
      <FeaturesPage data={featuresData} />
    </>
  );
}
