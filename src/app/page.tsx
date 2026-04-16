import CategoryCard from "@/components/CategoryCard";
import Link from "next/link";
import { getCategories } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { ScoresAtAGlance, ScoreBreakdownChart } from "@/components/charts/HomepageScoreWrapper";
import { ALL_SCORES } from "@/lib/scores";
import HomepageToolSearch from "@/components/HomepageToolSearchClient";
import QuickFinders from "@/components/QuickFinders";
import AiFinderWidget from "@/components/AiFinderWidget";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

// 24 services — 4 complete rows of 6 on desktop
const AI_SERVICES = [
  { name: "ChatGPT",        tagline: "The one everyone's heard of",      category: "LLM",          color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",  initial: "C" },
  { name: "Claude",         tagline: "The thoughtful one",               category: "LLM",          color: "bg-orange-500/10 text-orange-700 dark:text-orange-400",    initial: "C" },
  { name: "Gemini",         tagline: "Google's big bet",                 category: "LLM",          color: "bg-blue-500/10 text-blue-700 dark:text-blue-400",          initial: "G" },
  { name: "GPT-4o",         tagline: "Fast, multimodal, powerful",       category: "LLM",          color: "bg-teal-500/10 text-teal-700 dark:text-teal-400",          initial: "G" },
  { name: "Llama 3.3",      tagline: "Free & self-hostable",             category: "Open Source",  color: "bg-violet-500/10 text-violet-700 dark:text-violet-400",    initial: "L" },
  { name: "Mistral Large",  tagline: "Europe's AI champion",             category: "LLM",          color: "bg-rose-500/10 text-rose-700 dark:text-rose-400",          initial: "M" },
  { name: "Copilot",        tagline: "Lives in Microsoft Office",        category: "Coding",       color: "bg-sky-500/10 text-sky-700 dark:text-sky-400",             initial: "C" },
  { name: "GitHub Copilot", tagline: "Codes alongside you",              category: "Coding",       color: "bg-gray-500/10 text-gray-700 dark:text-gray-400",          initial: "G" },
  { name: "Cursor",         tagline: "Writes code while you think",      category: "Coding",       color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",    initial: "C" },
  { name: "Midjourney",     tagline: "Art that stops your scroll",       category: "Image",        color: "bg-pink-500/10 text-pink-700 dark:text-pink-400",          initial: "M" },
  { name: "DALL-E 3",       tagline: "Words → images, instantly",        category: "Image",        color: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400",          initial: "D" },
  { name: "Stable Diff.",   tagline: "Run it on your own machine",       category: "Image",        color: "bg-amber-500/10 text-amber-700 dark:text-amber-400",       initial: "S" },
  { name: "ElevenLabs",     tagline: "Clones voices frighteningly well", category: "Audio",        color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",    initial: "E", href: "https://try.elevenlabs.io/wecompareai" },
  { name: "Suno",           tagline: "Full songs in 10 seconds",         category: "Audio",        color: "bg-lime-500/10 text-lime-700 dark:text-lime-400",          initial: "S" },
  { name: "Perplexity",     tagline: "Google, but AI-first",             category: "Search",       color: "bg-teal-500/10 text-teal-700 dark:text-teal-400",          initial: "P" },
  { name: "Notion AI",      tagline: "Your docs, now smarter",           category: "Productivity", color: "bg-slate-500/10 text-slate-700 dark:text-slate-400",       initial: "N" },
  { name: "AWS Bedrock",    tagline: "Enterprise AI, AWS-style",         category: "Cloud",        color: "bg-orange-500/10 text-orange-700 dark:text-orange-400",    initial: "A" },
  { name: "Azure OpenAI",   tagline: "GPT inside your Azure tenant",     category: "Cloud",        color: "bg-blue-500/10 text-blue-700 dark:text-blue-400",          initial: "A" },
  { name: "Vertex AI",      tagline: "Google Cloud's AI arsenal",        category: "Cloud",        color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400", initial: "V" },
  { name: "Cohere",         tagline: "Built for business teams",         category: "Enterprise",   color: "bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400", initial: "C" },
  { name: "DeepSeek",       tagline: "Surprisingly good, very cheap",    category: "LLM",          color: "bg-slate-500/10 text-slate-700 dark:text-slate-400",       initial: "D" },
  { name: "Grok",           tagline: "The rebellious one",               category: "LLM",          color: "bg-zinc-500/10 text-zinc-700 dark:text-zinc-400",          initial: "G" },
  { name: "Runway",         tagline: "Hollywood VFX, no budget",         category: "Video",        color: "bg-purple-500/10 text-purple-700 dark:text-purple-400",    initial: "R" },
  { name: "Canva AI",       tagline: "Design without a designer",        category: "Design",       color: "bg-rose-500/10 text-rose-700 dark:text-rose-400",          initial: "C" },
];

// 4 plain-english cards — perfect 4-col row
const PLAIN_ENGLISH = [
  { emoji: "💸", technical: "Pricing per 1M tokens",  human: "How much writing a blog post actually costs",   border: "border-emerald-500/30", bg: "bg-emerald-500/5" },
  { emoji: "🧠", technical: "Context window",          human: "How long the AI remembers your conversation",   border: "border-blue-500/30",    bg: "bg-blue-500/5"    },
  { emoji: "⚡", technical: "Tokens per second",       human: "How fast it replies when you're in a rush",     border: "border-amber-500/30",   bg: "bg-amber-500/5"   },
  { emoji: "🔒", technical: "SOC 2 / HIPAA / GDPR",   human: "Can your legal team actually sleep at night?",  border: "border-rose-500/30",    bg: "bg-rose-500/5"    },
];

// 6 features — 3-col, 2-row grid
const WHY_FEATURES = [
  { emoji: "⚖️", title: "Zero vendor bias",              desc: "We're not paid by any AI company. Same table, same format, same criteria — no spin.",                                            color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  { emoji: "📅", title: "Fresh data, every second",        desc: "AI pricing changes fast. Our AI agents monitor every tool in real-time so you're never comparing outdated numbers.",                       color: "text-blue-600 dark:text-blue-400",       bg: "bg-blue-500/10"    },
  { emoji: "🏥", title: "HIPAA? GDPR? We've got it",    desc: "The only site that tracks SOC 2, HIPAA BAAs, GDPR residency, and on-prem options. Built for procurement teams.",               color: "text-rose-600 dark:text-rose-400",       bg: "bg-rose-500/10"    },
  { emoji: "🧪", title: "Live tests, not just specs",    desc: "Run prompts across models, benchmark real speed & cost, or take our quiz. We go beyond reading the marketing page.",           color: "text-amber-600 dark:text-amber-400",     bg: "bg-amber-500/10"   },
  { emoji: "🌍", title: "Coverage by country",           desc: "Where is the data stored? Available in your region? Which tools need a VPN? We tell you.",                                     color: "text-teal-600 dark:text-teal-400",       bg: "bg-teal-500/10"    },
  { emoji: "🔌", title: "Does it plug into your stack?", desc: "Every AI tool mapped to Zapier, Make.com, Notion, Slack, GitHub, Salesforce, and more. No more guessing.",                    color: "text-violet-600 dark:text-violet-400",   bg: "bg-violet-500/10"  },
];

// Quick nav pills — exactly 6, shown as 3+3 on mobile, single row on desktop
const QUICK_PILLS = [
  { label: "⚔️ LLM Showdown",  href: "/compare/ai-models" },
  { label: "💻 Coding Tools",   href: "/compare/ai-coding-tools" },
  { label: "☁️ Cloud AI",       href: "/compare/ai-cloud-providers" },
  { label: "🔌 Integrations",   href: "/research/integrations" },
  { label: "🔒 Compliance",     href: "/research/compliance" },
  { label: "🗺️ Feature Matrix", href: "/features" },
];

// Pain-point chips — exactly 4, shown as 2+2 on mobile, 4-in-a-row on desktop
const PAIN_CHIPS = [
  { text: "🚫 Stop paying for the wrong AI", color: "text-rose-600 dark:text-rose-400 bg-rose-500/8 border-rose-500/20" },
  { text: "⚡ See who's actually faster",    color: "text-amber-600 dark:text-amber-400 bg-amber-500/8 border-amber-500/20" },
  { text: "🔒 Know who stores your data",   color: "text-blue-600 dark:text-blue-400 bg-blue-500/8 border-blue-500/20" },
  { text: "💸 Find the cheapest that works", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/8 border-emerald-500/20" },
];

function SectionHeader({
  eyebrow, title, subtitle, align = "left", href, linkLabel,
}: {
  eyebrow: string; title: string; subtitle?: string;
  align?: "left" | "center"; href?: string; linkLabel?: string;
}) {
  return (
    <div className={`mb-8 ${align === "center" ? "text-center" : "flex items-start justify-between gap-4"}`}>
      <div>
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">{eyebrow}</p>
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground mt-1 max-w-lg">{subtitle}</p>}
      </div>
      {href && linkLabel && align === "left" && (
        <Link href={href} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 shrink-0 mt-1">
          {linkLabel}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}

function HomeJsonLd() {
  const websiteJsonLd = {
    "@context": "https://schema.org", "@type": "WebSite",
    name: "We Compare AI", url: SITE_URL,
    description: "The most accurate AI model & pricing comparison platform. Real-time benchmarks, token costs, and unbiased comparisons across OpenAI, Anthropic, Google & more.",
    publisher: { "@type": "Organization", name: "We Compare AI", url: SITE_URL },
    potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/categories?q={search_term_string}` }, "query-input": "required name=search_term_string" },
  };
  const orgJsonLd = {
    "@context": "https://schema.org", "@type": "Organization",
    name: "We Compare AI", url: SITE_URL,
    description: "The most accurate AI model & pricing comparison platform. Trusted by developers, startups & AI teams.",
    founder: [
      { "@type": "Person", name: "Jigar Acharya" },
      { "@type": "Person", name: "Saurabh Gera" },
    ],
  };
  const itemListJsonLd = {
    "@context": "https://schema.org", "@type": "ItemList",
    name: "AI Comparison Categories", url: `${SITE_URL}/categories`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Compare AI Models & LLMs",    url: `${SITE_URL}/compare/ai-models` },
      { "@type": "ListItem", position: 2, name: "Compare AI Coding Tools",      url: `${SITE_URL}/compare/ai-coding-tools` },
      { "@type": "ListItem", position: 3, name: "Compare AI Cloud Providers",   url: `${SITE_URL}/compare/ai-cloud-providers` },
      { "@type": "ListItem", position: 4, name: "Integration Graphs",           url: `${SITE_URL}/research/integrations` },
      { "@type": "ListItem", position: 5, name: "Security & Compliance Matrix", url: `${SITE_URL}/research/compliance` },
    ],
  };
  const faqJsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "What is the best site to compare AI models?",   acceptedAnswer: { "@type": "Answer", text: "We Compare AI covers 100+ AI services with 1,000+ data points updated in real-time by AI agents — pricing, benchmarks, compliance, and integrations." } },
      { "@type": "Question", name: "How do I compare ChatGPT, Claude, and Gemini?", acceptedAnswer: { "@type": "Answer", text: "Visit the AI Models page for a full side-by-side comparison of ChatGPT, Claude Opus 4, Gemini 2.5 Pro, Llama 3.1, Mistral Large, and more." } },
      { "@type": "Question", name: "Which AI tools are HIPAA compliant?",           acceptedAnswer: { "@type": "Answer", text: "Azure OpenAI, Amazon Bedrock, Google Gemini for Workspace, and Microsoft Copilot (M365 Enterprise) are HIPAA compliant with BAA availability." } },
      { "@type": "Question", name: "What is the best AI model for coding in 2026?", acceptedAnswer: { "@type": "Answer", text: "GitHub Copilot, Cursor, and Claude 3.7 Sonnet are the top coding tools. Claude leads on reasoning, Copilot on IDE integration, Cursor on autonomous coding." } },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function HomePage() {
  const [categories, totalCount] = await Promise.all([
    getCategories(),
    prisma.category.count(),
  ]);

  return (
    <div className="overflow-x-hidden">
      <HomeJsonLd />

      {/* ══ QUIZ BANNER ═════════════════════════════════════════════════════ */}
      <section className="px-4 pt-4 pb-0">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-background p-5 sm:p-6 grid sm:grid-cols-[auto_1fr_auto] gap-4 items-center">
            <div className="text-3xl leading-none">🤔</div>
            <div>
              <p className="text-sm font-bold text-foreground">Not sure which AI to use?</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Answer 6 quick questions about your use case, budget, and team — we&apos;ll pick your perfect AI stack. No jargon.
              </p>
            </div>
            <div className="flex sm:flex-col gap-2">
              <Link href="/research/finder" className="text-center px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 active:scale-95 transition-all whitespace-nowrap">
                Take the quiz →
              </Link>
              <Link href="/categories" className="text-center px-5 py-2 rounded-xl border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all whitespace-nowrap">
                Browse all
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section className="relative pt-10 pb-10 sm:pt-14 sm:pb-14 px-4">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-background/70 to-background" />

        <div className="max-w-7xl mx-auto">
          {/* Top: 2-column on desktop — headline left, stats right */}
          <div className="grid lg:grid-cols-2 gap-8 items-stretch mb-10">

            {/* Left: headline + CTAs */}
            <div className="flex flex-col gap-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Real-time data · 100+ AI tools tracked
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Compare AI Models,{" "}
                <span className="text-primary">Pricing</span>{" "}
                &amp; Performance —{" "}
                <span className="italic">Instantly</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Real-time benchmarks, token costs, and unbiased comparisons across OpenAI, Anthropic, Google &amp; more.
              </p>
              <p className="text-sm text-muted-foreground">
                Trusted by developers, startups &amp; AI teams to make smarter decisions.
              </p>
              {/* 3 Core Pillars */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                {[
                  { icon: "⚡", label: "Real-time pricing" },
                  { icon: "🧪", label: "Verified benchmarks" },
                  { icon: "🔍", label: "Unbiased comparisons" },
                ].map((p) => (
                  <span key={p.label} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-muted text-foreground">
                    {p.icon} {p.label}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link href="/categories" className="group px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/25 flex items-center gap-2">
                  Start Comparing Free
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link href="/research/finder" className="px-7 py-3 rounded-xl border border-border bg-background text-foreground font-semibold text-sm hover:border-primary/50 hover:bg-muted active:scale-95 transition-all">
                  🎯 Help me pick an AI
                </Link>
              </div>

              {/* Stats — 4 cols × 2 rows */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {[
                  { value: `${totalCount}`, label: "Battle arenas",  color: "text-primary",                              href: "/vs" },
                  { value: "100+",          label: "AI tools",       color: "text-violet-600 dark:text-violet-400",      href: "/categories" },
                  { value: "1,000+",        label: "Data points",    color: "text-emerald-600 dark:text-emerald-400",    href: "/rankings" },
                  { value: "Live",          label: "Updated",        color: "text-amber-600 dark:text-amber-400",        href: "/research/model-tracker" },
                  { value: "4,000+",        label: "VS pages",       color: "text-rose-600 dark:text-rose-400",          href: "/vs" },
                  { value: "53",            label: "Rankings",       color: "text-sky-600 dark:text-sky-400",            href: "/rankings" },
                  { value: "17",            label: "Professions",    color: "text-fuchsia-600 dark:text-fuchsia-400",    href: "/for" },
                  { value: "25",            label: "Best For",       color: "text-teal-600 dark:text-teal-400",          href: "/categories" },
                ].map((s) => (
                  <Link key={s.label} href={s.href} className="rounded-xl border border-border bg-card px-3 py-2.5 flex flex-col gap-0.5 hover:bg-muted/40 hover:border-primary/30 transition-colors">
                    <div className={`text-lg font-extrabold leading-tight tabular-nums ${s.color}`}>{s.value}</div>
                    <div className="text-[10px] font-semibold text-foreground leading-tight">{s.label}</div>
                  </Link>
                ))}
              </div>

              {/* 3-question AI finder — grows to fill remaining height */}
              <div className="flex-1">
                <AiFinderWidget className="h-full" />
              </div>
            </div>

            {/* Right: search card with pickers */}
            <div className="flex flex-col gap-4 h-full">
              {/* Search widget */}
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Compare any AI tools</p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wide">Free</span>
                </div>
                <HomepageToolSearch />
              </div>

              {/* Quick finders */}
              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quick finders</p>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wide">Free</span>
                </div>
                <QuickFinders />
              </div>
            </div>

          </div>

          {/* Bottom: all features grid — fills full width */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">

            {/* Compare AI */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Compare AI</p>
              {[
                { label: "By Category",          href: "/categories",           free: true  },
                { label: "By Domain",             href: "/domains",              free: true  },
                { label: "By Country",            href: "/countries",            free: true  },
                { label: "By Feature",            href: "/features",             free: true  },
                { label: "Integration Graphs",    href: "/research/integrations",free: true  },
                { label: "Security & Compliance", href: "/research/compliance",  free: true  },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="flex items-center justify-between gap-1 text-xs text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all group">
                  <span className="group-hover:text-primary truncate">{l.label}</span>
                  <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded-full border ${l.free ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-violet-500/10 text-violet-600 border-violet-500/20"}`}>{l.free ? "Free" : "Pro"}</span>
                </Link>
              ))}
            </div>

            {/* Live Tools */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">Live Tools</p>
              {[
                { label: "Compare AI Models Live", href: "/research/compare",       free: false },
                { label: "Real-Time Benchmarking", href: "/research/benchmark",     free: false },
                { label: "AI Tool Finder",          href: "/research/finder",        free: false },
                { label: "Prompt Battle",            href: "/research/prompt-battle",free: false },
                { label: "Cost-Per-Task",            href: "/research/cost-per-task",free: true  },
                { label: "Use-Case Playbooks",       href: "/research/playbooks",    free: true  },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="flex items-center justify-between gap-1 text-xs text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all group">
                  <span className="group-hover:text-primary truncate">{l.label}</span>
                  <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded-full border ${l.free ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-violet-500/10 text-violet-600 border-violet-500/20"}`}>{l.free ? "Free" : "Pro"}</span>
                </Link>
              ))}
            </div>

            {/* Business Tools */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Business Tools</p>
              {[
                { label: "ROI Calculator",        href: "/research/roi-calculator",   free: false },
                { label: "Workflow Builder",       href: "/research/workflow-builder", free: false },
                { label: "Procurement Assistant", href: "/research/procurement",      free: false },
                { label: "Your AI Stack",          href: "/research/ai-stack",         free: false },
                { label: "Migration Assistant",    href: "/research/migration",        free: false },
                { label: "Model Update Tracker",  href: "/research/model-tracker",    free: true  },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="flex items-center justify-between gap-1 text-xs text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all group">
                  <span className="group-hover:text-primary truncate">{l.label}</span>
                  <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded-full border ${l.free ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-violet-500/10 text-violet-600 border-violet-500/20"}`}>{l.free ? "Free" : "Pro"}</span>
                </Link>
              ))}
            </div>

            {/* Market Intelligence */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Market Intelligence</p>
              {[
                { label: "Market Share Dashboard", href: "/research/market-share",     free: true },
                { label: "AI Pricing Index",        href: "/research/pricing-index",    free: true },
                { label: "Vendor Risk Score",        href: "/research/vendor-risk",      free: true },
                { label: "Dependency Graph",         href: "/research/dependency-graph", free: true },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="flex items-center justify-between gap-1 text-xs text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all group">
                  <span className="group-hover:text-primary truncate">{l.label}</span>
                  <span className="shrink-0 text-[9px] px-1.5 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Free</span>
                </Link>
              ))}
            </div>

            {/* Technical */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Technical</p>
              {[
                { label: "Latency Heatmap",          href: "/research/latency-heatmap",  free: true  },
                { label: "Reasoning Stress Tests",    href: "/research/reasoning-tests",  free: true  },
                { label: "Data Governance Simulator", href: "/research/data-governance",  free: false },
                { label: "Blog",                      href: "/blog",                       free: true  },
                { label: "About Us",                  href: "/about",                      free: true  },
                { label: "Contact",                   href: "/contact",                    free: true  },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="flex items-center justify-between gap-1 text-xs text-muted-foreground hover:text-foreground hover:translate-x-0.5 transition-all group">
                  <span className="group-hover:text-primary truncate">{l.label}</span>
                  <span className={`shrink-0 text-[9px] px-1.5 py-0.5 rounded-full border ${l.free ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-violet-500/10 text-violet-600 border-violet-500/20"}`}>{l.free ? "Free" : "Pro"}</span>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ══ SCORES AT A GLANCE ══════════════════════════════════════════════ */}
      <section className="px-4 pt-6 pb-2">
        <div className="max-w-7xl mx-auto">
          <ScoresAtAGlance tools={ALL_SCORES} />
        </div>
      </section>

      {/* ══ SCORE BREAKDOWN ═════════════════════════════════════════════════ */}
      <section className="px-4 pt-4 pb-6">
        <div className="max-w-7xl mx-auto">
          <ScoreBreakdownChart tools={ALL_SCORES} />
        </div>
      </section>

      {/* ══ AI SHOWDOWN — CATEGORIES ════════════════════════════════════════ */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="⚔️ The AI Showdown"
            title="Let the models battle it out"
            subtitle="Real-world matchups. You pick the winner."
            href="/categories"
            linkLabel="All arenas"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}

            {/* By Domain */}
            <Link href="/domains" className="group block p-6 rounded-xl border border-border bg-background hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">By Domain</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    Compare AI tools by industry vertical — Healthcare, Finance, Legal, Education, Marketing, and more.
                  </p>
                </div>
              </div>
            </Link>

            {/* By Country */}
            <Link href="/countries" className="group block p-6 rounded-xl border border-border bg-background hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">By Country</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    AI availability, data residency and compliance by region — US, EU (GDPR), UK, Canada, Australia, India, and more.
                  </p>
                </div>
              </div>
            </Link>

            {/* By Feature */}
            <Link href="/features" className="group block p-6 rounded-xl border border-border bg-background hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">By Feature</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    Find AI tools by specific capability — Image generation, Voice cloning, Code completion, Long context, Function calling, and more.
                  </p>
                </div>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* ══ AI IN PLAIN ENGLISH ═════════════════════════════════════════════ */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            align="center"
            eyebrow="🧠 AI in Plain English"
            title="We translate the jargon so you don't have to"
            subtitle="Every spec we track — in plain human language."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PLAIN_ENGLISH.map((p) => (
              <div
                key={p.technical}
                className={`rounded-2xl border ${p.border} ${p.bg} p-5 flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-200 cursor-default`}
              >
                <span className="text-3xl leading-none">{p.emoji}</span>
                <div className="flex-1 flex flex-col justify-end gap-1">
                  <p className="text-xs font-mono text-muted-foreground line-through">{p.technical}</p>
                  <p className="text-sm font-semibold text-foreground leading-snug">{p.human}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ AI SERVICES MATCHMAKER ══════════════════════════════════════════ */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            eyebrow="💘 Your AI Matchmaker"
            title="100+ AI services, all in one place"
            subtitle="Every model has a personality. Find yours."
            href="/domains"
            linkLabel="By domain"
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
            {AI_SERVICES.map((s) => {
              const cardClass = "group flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:-translate-y-1 hover:shadow-md transition-all duration-200 text-center";
              const inner = (
                <>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform shrink-0 ${s.color}`}>
                    {s.initial}
                  </div>
                  <div className="w-full min-h-[40px] flex flex-col justify-center">
                    <div className="text-xs font-semibold text-foreground leading-tight">{s.name}</div>
                    <div className="text-xs text-muted-foreground leading-tight mt-0.5 group-hover:hidden">{s.category}</div>
                    <div className="text-xs text-primary leading-tight mt-0.5 hidden group-hover:block">{s.tagline}</div>
                  </div>
                </>
              );
              return s.href ? (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer sponsored" className={cardClass}>{inner}</a>
              ) : (
                <div key={s.name} className={cardClass}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ WHY WE COMPARE ══════════════════════════════════════════════════ */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            align="center"
            eyebrow="🏆 We Compare So You Don't Have To"
            title="Real-world tests. Zero marketing hype."
            subtitle="We're the nerdy friend who read all the docs, tested all the APIs, and saved you from a very expensive mistake."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {WHY_FEATURES.map((f) => (
              <div
                key={f.title}
                className="group flex gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform duration-200 ${f.bg}`}>
                  {f.emoji}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOUNDER NOTE ════════════════════════════════════════════════════ */}
      <section className="px-4 pb-16 sm:pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-6">Why we built this</p>
            <div className="grid sm:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold border border-primary/20">JA</div>
                  <div className="text-xs text-muted-foreground text-center leading-tight">Jigar Acharya<br /><span className="text-[10px]">Solution Architect</span></div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Jigar brings over 20 years of experience across desktop, web, mobile, cloud, and IoT solutions. This breadth of hands-on expertise drives the vision behind AI Compare — making it easier for professionals to navigate the ever-growing AI ecosystem.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold border border-primary/20">SG</div>
                  <div className="text-xs text-muted-foreground text-center leading-tight">Saurabh Gera<br /><span className="text-[10px]">Infrastructure Architect</span></div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Saurabh is a director-level technology leader with over 15 years of experience building large-scale infrastructure. His deep expertise ensures AI Compare is not only informative but built on a solid, reliable foundation.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-border">
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                We Compare AI is the tool we wish had existed. No paid placements. No affiliate bias. Just clean, structured data that helps you make a decision you won&apos;t regret.
              </p>
              <Link href="/about" className="inline-block text-xs font-semibold text-primary hover:underline">Read the full story →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══ BOTTOM CTA ══════════════════════════════════════════════════════ */}
      <section className="px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-primary/20 bg-primary/5 px-6 sm:px-12 py-14 text-center">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.10),transparent_70%)]" />
            <div className="text-4xl mb-4">🎯</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Your AI stack shouldn&apos;t be a guessing game.
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-sm mb-1">
              Stop switching tools every quarter. Find what actually works for your workflow — with data, not hope.
            </p>
            <p className="text-xs text-muted-foreground italic mb-8">
              Warning: some models think they&apos;re smarter than you. We&apos;ll help you find out.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/categories"
                className="group px-7 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/25 flex items-center gap-2"
              >
                Start Comparing — It&apos;s Free
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/research/finder"
                className="px-7 py-3 rounded-xl border border-border bg-background text-foreground font-semibold text-sm hover:border-primary/50 hover:bg-muted active:scale-95 transition-all"
              >
                🎯 Find my perfect AI
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
