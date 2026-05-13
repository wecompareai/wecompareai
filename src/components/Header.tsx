"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import AuthButton from "@/components/auth/AuthButton";

const chevron = (open: boolean) => (
  <svg
    className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

function useDropdown() {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onEnter = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const onLeave = () => { timer.current = setTimeout(() => setOpen(false), 150); };
  return { open, onEnter, onLeave };
}

const freeBadge = (
  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span>
);
const premiumBadge = (
  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20 shrink-0">Premium</span>
);
const newBadge = (
  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">New</span>
);

export default function Header() {
  const compare  = useDropdown();
  const forYou   = useDropdown();
  const rankings = useDropdown();
  const tools    = useDropdown();
  const insights = useDropdown();

  const [mobileOpen,         setMobileOpen]         = useState(false);
  const [mobileCompareOpen,  setMobileCompareOpen]  = useState(false);
  const [mobileForYouOpen,   setMobileForYouOpen]   = useState(false);
  const [mobileRankingsOpen, setMobileRankingsOpen] = useState(false);
  const [mobileToolsOpen,    setMobileToolsOpen]    = useState(false);
  const [mobileInsightsOpen, setMobileInsightsOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

  function closeMobile() {
    setMobileOpen(false);
    setMobileCompareOpen(false);
    setMobileForYouOpen(false);
    setMobileRankingsOpen(false);
    setMobileToolsOpen(false);
    setMobileInsightsOpen(false);
  }

  const navBtn = (label: string, open: boolean) => (
    <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
      {label} {chevron(open)}
    </button>
  );

  const item = (href: string, label: React.ReactNode, badge?: React.ReactNode) => (
    <Link href={href} className="flex items-center justify-between gap-2 px-4 py-1.5 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors">
      <span className="truncate">{label}</span>
      {badge}
    </Link>
  );

  const seeAll = (href: string, label: string) => (
    <Link href={href} className="block px-4 py-2 text-sm font-medium text-primary hover:bg-muted transition-colors">
      {label}
    </Link>
  );

  const colHeader = (text: string) => (
    <div className="px-4 pt-2 pb-1.5 border-b border-border mb-1">
      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{text}</span>
    </div>
  );

  const subHeader = (text: string) => (
    <div className="px-4 pt-2 pb-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{text}</span>
    </div>
  );

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center h-full py-1 shrink-0" onClick={closeMobile}>
            <Image src="/logo-light.svg" alt="We Compare AI" width={240} height={52} className="h-9 sm:h-11 w-auto object-contain block dark:hidden" />
            <Image src="/logo-dark.svg"  alt="We Compare AI" width={240} height={52} className="h-9 sm:h-11 w-auto object-contain hidden dark:block" />
          </Link>

          {/* Desktop nav (5 parents) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">

            {/* ── Compare ── */}
            <div className="relative" onMouseEnter={compare.onEnter} onMouseLeave={compare.onLeave}>
              {navBtn("Compare", compare.open)}
              {compare.open && (
                <div style={{ width: 720 }} className="absolute top-full left-0 mt-2 rounded-lg border border-border bg-background shadow-lg z-50 grid grid-cols-3 divide-x divide-border">
                  <div className="py-2 min-w-0">
                    {colHeader("Discover & Analyze")}
                    {item("/categories",                "By Category",          freeBadge)}
                    {item("/domains",                   "By Domain",            freeBadge)}
                    {item("/countries",                 "By Country",           freeBadge)}
                    {item("/features",                  "By Feature",           freeBadge)}
                    {item("/research/integrations",     "Integration Graphs",   freeBadge)}
                    {item("/research/compliance",       "Security & Compliance",freeBadge)}
                    {item("/research/cost-per-task",    "Cost-Per-Task",        freeBadge)}
                    {item("/research/playbooks",        "Use-Case Playbooks",   freeBadge)}
                    {item("/research/model-tracker",    "Model Update Tracker", freeBadge)}
                  </div>
                  <div className="py-2 min-w-0">
                    {colHeader("Head-to-Head (VS)")}
                    {subHeader("AI Models")}
                    {item("/vs/chatgpt-vs-claude",       "ChatGPT vs Claude")}
                    {item("/vs/chatgpt-vs-gemini",       "ChatGPT vs Gemini")}
                    {item("/vs/claude-vs-gemini",        "Claude vs Gemini")}
                    {item("/vs/deepseek-vs-chatgpt",     "DeepSeek vs ChatGPT")}
                    {subHeader("Coding Tools")}
                    {item("/vs/copilot-vs-cursor",       "Copilot vs Cursor")}
                    {item("/vs/cursor-vs-windsurf",      "Cursor vs Windsurf")}
                    {item("/vs/claude-code-vs-copilot",  "Claude Code vs Copilot")}
                    {subHeader("Image & Video")}
                    {item("/vs/midjourney-vs-dalle",     "Midjourney vs DALL-E 3")}
                    {item("/vs/sora-vs-runway",          "Sora vs Runway Gen-3")}
                    {seeAll("/vs",                       "See all 28 →")}
                  </div>
                  <div className="py-2 min-w-0">
                    {colHeader("Alternatives")}
                    {item("/alternatives/chatgpt-alternatives",        "🤖 ChatGPT Alts")}
                    {item("/alternatives/claude-alternatives",         "🧠 Claude Alts")}
                    {item("/alternatives/gemini-alternatives",         "✨ Gemini Alts")}
                    {item("/alternatives/github-copilot-alternatives", "💻 Copilot Alts")}
                    {item("/alternatives/cursor-alternatives",         "⌨️ Cursor Alts")}
                    {item("/alternatives/midjourney-alternatives",     "🎨 Midjourney Alts")}
                    {item("/alternatives/elevenlabs-alternatives",     "🎙️ ElevenLabs Alts")}
                    {item("/alternatives/perplexity-alternatives",     "🔬 Perplexity Alts")}
                    {seeAll("/alternatives",                           "See all alternatives →")}
                  </div>
                </div>
              )}
            </div>

            {/* ── For You ── */}
            <div className="relative" onMouseEnter={forYou.onEnter} onMouseLeave={forYou.onLeave}>
              {navBtn("For You", forYou.open)}
              {forYou.open && (
                <div style={{ width: 520 }} className="absolute top-full left-0 mt-2 rounded-lg border border-border bg-background shadow-lg z-50 grid grid-cols-2 divide-x divide-border">
                  <div className="py-2 min-w-0">
                    {colHeader("By Profession")}
                    {item("/for/lawyers",          "⚖️ Lawyers")}
                    {item("/for/doctors",          "🩺 Doctors")}
                    {item("/for/teachers",         "📚 Teachers")}
                    {item("/for/developers",       "💻 Developers")}
                    {item("/for/marketers",        "📣 Marketers")}
                    {item("/for/designers",        "🎨 Designers")}
                    {item("/for/writers",          "✍️ Writers")}
                    {item("/for/students",         "🎓 Students")}
                    {item("/for/sales-teams",      "🎯 Sales Teams")}
                    {item("/for/hr-teams",         "🤝 HR Teams")}
                    {item("/for/accountants",      "📊 Accountants")}
                    {item("/for/real-estate",      "🏠 Real Estate")}
                    {item("/for/content-creators", "🎬 Content Creators")}
                    {item("/for/small-business",   "🏪 Small Business")}
                    {item("/for/recruiters",       "🔍 Recruiters")}
                    {seeAll("/for",                "See all 17 →")}
                  </div>
                  <div className="py-2 min-w-0">
                    {colHeader("By Use Case")}
                    {item("/best/coding",            "💻 Coding")}
                    {item("/best/writing",           "✍️ Writing")}
                    {item("/best/marketing",         "📣 Marketing")}
                    {item("/best/video-generation",  "🎬 Video Generation")}
                    {item("/best/startups",          "🚀 Startups")}
                    {item("/best/business",          "🏢 Business")}
                    {item("/best/image-generation",  "🎨 Image Generation")}
                    {item("/best/voice-cloning",     "🎙️ Voice Cloning")}
                    {item("/best/social-media",      "📱 Social Media")}
                    {item("/best/students",          "🎓 Students")}
                    {seeAll("/best",                 "See all 22 →")}
                  </div>
                </div>
              )}
            </div>

            {/* ── Rankings ── */}
            <div className="relative" onMouseEnter={rankings.onEnter} onMouseLeave={rankings.onLeave}>
              {navBtn("Rankings", rankings.open)}
              {rankings.open && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-lg border border-border bg-background shadow-lg py-2 z-50">
                  {item("/rankings",                  "🏆 Overall Rankings",     freeBadge)}
                  {item("/research/llm-leaderboard",  "📊 LLM Leaderboard",      freeBadge)}
                  {item("/rankings?category=LLM",     "🤖 Best LLMs",            freeBadge)}
                  {item("/rankings?category=Coding",  "💻 Best Coding Tools",    freeBadge)}
                  {item("/rankings?category=Image",   "🎨 Best Image Generators",freeBadge)}
                  {item("/rankings?category=Audio",   "🎙️ Best Audio Tools",     freeBadge)}
                  {item("/rankings?category=Cloud",   "☁️ Best Cloud AI",        freeBadge)}
                </div>
              )}
            </div>

            {/* ── Tools ── */}
            <div className="relative" onMouseEnter={tools.onEnter} onMouseLeave={tools.onLeave}>
              {navBtn("Tools", tools.open)}
              {tools.open && (
                <div style={{ width: 720 }} className="absolute top-full right-0 mt-2 rounded-lg border border-border bg-background shadow-lg z-50 grid grid-cols-3 divide-x divide-border">
                  <div className="py-2 min-w-0">
                    {colHeader("Discover")}
                    {item("/search",          "🔍 Tool Search",   newBadge)}
                    {item("/research/finder", "🎯 AI Tool Finder",premiumBadge)}
                  </div>
                  <div className="py-2 min-w-0">
                    {colHeader("Live")}
                    {item("/research/compare",        "Compare Models Live",    premiumBadge)}
                    {item("/research/benchmark",      "Real-Time Benchmarking", premiumBadge)}
                    {item("/research/prompt-battle",  "⚔️ Prompt Battle",       premiumBadge)}
                  </div>
                  <div className="py-2 min-w-0">
                    {colHeader("Business")}
                    {item("/research/roi-calculator",   "💰 ROI Calculator",      premiumBadge)}
                    {item("/research/workflow-builder", "🔧 Workflow Builder",    premiumBadge)}
                    {item("/research/procurement",      "📋 Procurement",         premiumBadge)}
                    {item("/research/ai-stack",         "🧩 Your AI Stack",       premiumBadge)}
                    {item("/research/migration",        "🔄 Migration",           premiumBadge)}
                    {item("/research/data-governance",  "🔒 Data Governance",     premiumBadge)}
                  </div>
                </div>
              )}
            </div>

            {/* ── Insights ── */}
            <div className="relative" onMouseEnter={insights.onEnter} onMouseLeave={insights.onLeave}>
              {navBtn("Insights", insights.open)}
              {insights.open && (
                <div style={{ width: 720 }} className="absolute top-full right-0 mt-2 rounded-lg border border-border bg-background shadow-lg z-50 grid grid-cols-3 divide-x divide-border">
                  <div className="py-2 min-w-0">
                    {colHeader("Market & Technical")}
                    {subHeader("Market Intelligence")}
                    {item("/research/market-share",     "📊 Market Share",      freeBadge)}
                    {item("/research/pricing-index",    "💲 Pricing Index",     freeBadge)}
                    {item("/research/vendor-risk",      "🛡️ Vendor Risk",       freeBadge)}
                    {item("/research/dependency-graph", "🕸️ Dependency Graph",  freeBadge)}
                    {subHeader("Technical")}
                    {item("/research/latency-heatmap",  "🌍 Latency Heatmap",   freeBadge)}
                    {item("/research/reasoning-tests",  "🧪 Reasoning Tests",   freeBadge)}
                  </div>
                  <div className="py-2 min-w-0">
                    {colHeader("Content")}
                    {item("/blog",            "✍️ Blog",          freeBadge)}
                    {item("/research/ai-news","📡 AI News Digest",freeBadge)}
                    {item("/newsletter",      "📬 Newsletter",    freeBadge)}
                    {item("/directory",       "📁 Directory",     freeBadge)}
                    {item("/glossary",        "📖 Glossary",      freeBadge)}
                  </div>
                  <div className="py-2 min-w-0">
                    {colHeader("Company")}
                    {item("/about",   "About Us",            freeBadge)}
                    {item("/contact", "Contact Us",          freeBadge)}
                    {item("/press",   "📰 Press & Media Kit",freeBadge)}
                    {item("/submit",  "➕ Submit Your Tool", freeBadge)}
                  </div>
                </div>
              )}
            </div>

            <AuthButton />
          </nav>

          {/* Mobile: auth + hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <AuthButton />
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background px-4 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">

          {/* Compare */}
          <MobileAccordion label="Compare" open={mobileCompareOpen} onToggle={() => setMobileCompareOpen(v => !v)}>
            <MobileSection label="Discover & Analyze" />
            <MobileLink href="/categories"              onClick={closeMobile}>By Category</MobileLink>
            <MobileLink href="/domains"                 onClick={closeMobile}>By Domain</MobileLink>
            <MobileLink href="/countries"               onClick={closeMobile}>By Country</MobileLink>
            <MobileLink href="/features"                onClick={closeMobile}>By Feature</MobileLink>
            <MobileLink href="/research/integrations"   onClick={closeMobile}>Integration Graphs</MobileLink>
            <MobileLink href="/research/compliance"     onClick={closeMobile}>Security &amp; Compliance</MobileLink>
            <MobileLink href="/research/cost-per-task"  onClick={closeMobile}>💸 Cost-Per-Task</MobileLink>
            <MobileLink href="/research/playbooks"      onClick={closeMobile}>📖 Use-Case Playbooks</MobileLink>
            <MobileLink href="/research/model-tracker"  onClick={closeMobile}>📡 Model Update Tracker</MobileLink>

            <MobileSection label="Head-to-Head (VS)" />
            <MobileSubLabel>AI Models</MobileSubLabel>
            <MobileLink href="/vs/chatgpt-vs-claude"       onClick={closeMobile}>ChatGPT vs Claude</MobileLink>
            <MobileLink href="/vs/chatgpt-vs-gemini"       onClick={closeMobile}>ChatGPT vs Gemini</MobileLink>
            <MobileLink href="/vs/claude-vs-gemini"        onClick={closeMobile}>Claude vs Gemini</MobileLink>
            <MobileLink href="/vs/deepseek-vs-chatgpt"     onClick={closeMobile}>DeepSeek vs ChatGPT</MobileLink>
            <MobileSubLabel>Coding Tools</MobileSubLabel>
            <MobileLink href="/vs/copilot-vs-cursor"       onClick={closeMobile}>Copilot vs Cursor</MobileLink>
            <MobileLink href="/vs/cursor-vs-windsurf"      onClick={closeMobile}>Cursor vs Windsurf</MobileLink>
            <MobileLink href="/vs/claude-code-vs-copilot"  onClick={closeMobile}>Claude Code vs Copilot</MobileLink>
            <MobileSubLabel>Image &amp; Video</MobileSubLabel>
            <MobileLink href="/vs/midjourney-vs-dalle"     onClick={closeMobile}>Midjourney vs DALL-E 3</MobileLink>
            <MobileLink href="/vs/sora-vs-runway"          onClick={closeMobile}>Sora vs Runway Gen-3</MobileLink>
            <MobileLink href="/vs"                         onClick={closeMobile}>See all 28 comparisons →</MobileLink>

            <MobileSection label="Alternatives" />
            <MobileLink href="/alternatives/chatgpt-alternatives"        onClick={closeMobile}>🤖 ChatGPT Alternatives</MobileLink>
            <MobileLink href="/alternatives/claude-alternatives"         onClick={closeMobile}>🧠 Claude Alternatives</MobileLink>
            <MobileLink href="/alternatives/gemini-alternatives"         onClick={closeMobile}>✨ Gemini Alternatives</MobileLink>
            <MobileLink href="/alternatives/github-copilot-alternatives" onClick={closeMobile}>💻 GitHub Copilot Alternatives</MobileLink>
            <MobileLink href="/alternatives/cursor-alternatives"         onClick={closeMobile}>⌨️ Cursor Alternatives</MobileLink>
            <MobileLink href="/alternatives/midjourney-alternatives"     onClick={closeMobile}>🎨 Midjourney Alternatives</MobileLink>
            <MobileLink href="/alternatives/elevenlabs-alternatives"     onClick={closeMobile}>🎙️ ElevenLabs Alternatives</MobileLink>
            <MobileLink href="/alternatives/perplexity-alternatives"     onClick={closeMobile}>🔬 Perplexity Alternatives</MobileLink>
            <MobileLink href="/alternatives"                             onClick={closeMobile}>See all alternatives →</MobileLink>
          </MobileAccordion>

          {/* For You */}
          <MobileAccordion label="For You" open={mobileForYouOpen} onToggle={() => setMobileForYouOpen(v => !v)}>
            <MobileSection label="By Profession" />
            <MobileLink href="/for/lawyers"          onClick={closeMobile}>⚖️ Lawyers</MobileLink>
            <MobileLink href="/for/doctors"          onClick={closeMobile}>🩺 Doctors</MobileLink>
            <MobileLink href="/for/teachers"         onClick={closeMobile}>📚 Teachers</MobileLink>
            <MobileLink href="/for/developers"       onClick={closeMobile}>💻 Developers</MobileLink>
            <MobileLink href="/for/marketers"        onClick={closeMobile}>📣 Marketers</MobileLink>
            <MobileLink href="/for/designers"        onClick={closeMobile}>🎨 Designers</MobileLink>
            <MobileLink href="/for/writers"          onClick={closeMobile}>✍️ Writers</MobileLink>
            <MobileLink href="/for/students"         onClick={closeMobile}>🎓 Students</MobileLink>
            <MobileLink href="/for/sales-teams"      onClick={closeMobile}>🎯 Sales Teams</MobileLink>
            <MobileLink href="/for/hr-teams"         onClick={closeMobile}>🤝 HR Teams</MobileLink>
            <MobileLink href="/for/accountants"      onClick={closeMobile}>📊 Accountants</MobileLink>
            <MobileLink href="/for/real-estate"      onClick={closeMobile}>🏠 Real Estate</MobileLink>
            <MobileLink href="/for/content-creators" onClick={closeMobile}>🎬 Content Creators</MobileLink>
            <MobileLink href="/for/small-business"   onClick={closeMobile}>🏪 Small Business</MobileLink>
            <MobileLink href="/for/recruiters"       onClick={closeMobile}>🔍 Recruiters</MobileLink>
            <MobileLink href="/for"                  onClick={closeMobile}>See all 17 professions →</MobileLink>

            <MobileSection label="By Use Case" />
            <MobileLink href="/best/coding"            onClick={closeMobile}>💻 Coding</MobileLink>
            <MobileLink href="/best/writing"           onClick={closeMobile}>✍️ Writing</MobileLink>
            <MobileLink href="/best/marketing"         onClick={closeMobile}>📣 Marketing</MobileLink>
            <MobileLink href="/best/video-generation"  onClick={closeMobile}>🎬 Video Generation</MobileLink>
            <MobileLink href="/best/startups"          onClick={closeMobile}>🚀 Startups</MobileLink>
            <MobileLink href="/best/business"          onClick={closeMobile}>🏢 Business</MobileLink>
            <MobileLink href="/best/image-generation"  onClick={closeMobile}>🎨 Image Generation</MobileLink>
            <MobileLink href="/best/voice-cloning"     onClick={closeMobile}>🎙️ Voice Cloning</MobileLink>
            <MobileLink href="/best/social-media"      onClick={closeMobile}>📱 Social Media</MobileLink>
            <MobileLink href="/best/students"          onClick={closeMobile}>🎓 Students</MobileLink>
            <MobileLink href="/best"                   onClick={closeMobile}>See all 22 use cases →</MobileLink>
          </MobileAccordion>

          {/* Rankings */}
          <MobileAccordion label="Rankings" open={mobileRankingsOpen} onToggle={() => setMobileRankingsOpen(v => !v)}>
            <MobileLink href="/rankings"                   onClick={closeMobile}>🏆 Overall Rankings</MobileLink>
            <MobileLink href="/research/llm-leaderboard"   onClick={closeMobile}>📊 LLM Leaderboard</MobileLink>
            <MobileLink href="/rankings?category=LLM"      onClick={closeMobile}>🤖 Best LLMs</MobileLink>
            <MobileLink href="/rankings?category=Coding"   onClick={closeMobile}>💻 Best Coding Tools</MobileLink>
            <MobileLink href="/rankings?category=Image"    onClick={closeMobile}>🎨 Best Image Generators</MobileLink>
            <MobileLink href="/rankings?category=Audio"    onClick={closeMobile}>🎙️ Best Audio Tools</MobileLink>
            <MobileLink href="/rankings?category=Cloud"    onClick={closeMobile}>☁️ Best Cloud AI</MobileLink>
          </MobileAccordion>

          {/* Tools */}
          <MobileAccordion label="Tools" open={mobileToolsOpen} onToggle={() => setMobileToolsOpen(v => !v)}>
            <MobileSection label="Discover" />
            <MobileLink href="/search"                  onClick={closeMobile}>🔍 Tool Search (New)</MobileLink>
            <MobileLink href="/research/finder"         onClick={closeMobile}>🎯 AI Tool Finder</MobileLink>

            <MobileSection label="Live" />
            <MobileLink href="/research/compare"        onClick={closeMobile}>Compare AI Models Live</MobileLink>
            <MobileLink href="/research/benchmark"      onClick={closeMobile}>Real-Time Benchmarking</MobileLink>
            <MobileLink href="/research/prompt-battle"  onClick={closeMobile}>⚔️ Prompt Battle</MobileLink>

            <MobileSection label="Business" />
            <MobileLink href="/research/roi-calculator"    onClick={closeMobile}>💰 ROI Calculator</MobileLink>
            <MobileLink href="/research/workflow-builder"  onClick={closeMobile}>🔧 Workflow Builder</MobileLink>
            <MobileLink href="/research/procurement"       onClick={closeMobile}>📋 Procurement Assistant</MobileLink>
            <MobileLink href="/research/ai-stack"          onClick={closeMobile}>🧩 Your AI Stack</MobileLink>
            <MobileLink href="/research/migration"         onClick={closeMobile}>🔄 Migration Assistant</MobileLink>
            <MobileLink href="/research/data-governance"   onClick={closeMobile}>🔒 Data Governance Simulator</MobileLink>
          </MobileAccordion>

          {/* Insights */}
          <MobileAccordion label="Insights" open={mobileInsightsOpen} onToggle={() => setMobileInsightsOpen(v => !v)}>
            <MobileSection label="Market Intelligence" />
            <MobileLink href="/research/market-share"     onClick={closeMobile}>📊 Market Share Dashboard</MobileLink>
            <MobileLink href="/research/pricing-index"    onClick={closeMobile}>💲 AI Pricing Index</MobileLink>
            <MobileLink href="/research/vendor-risk"      onClick={closeMobile}>🛡️ Vendor Risk Score</MobileLink>
            <MobileLink href="/research/dependency-graph" onClick={closeMobile}>🕸️ Dependency Graph</MobileLink>

            <MobileSection label="Technical" />
            <MobileLink href="/research/latency-heatmap" onClick={closeMobile}>🌍 Latency Heatmap</MobileLink>
            <MobileLink href="/research/reasoning-tests" onClick={closeMobile}>🧪 Reasoning Stress Tests</MobileLink>

            <MobileSection label="Content" />
            <MobileLink href="/blog"             onClick={closeMobile}>✍️ Blog</MobileLink>
            <MobileLink href="/research/ai-news" onClick={closeMobile}>📡 AI News Digest</MobileLink>
            <MobileLink href="/newsletter"       onClick={closeMobile}>📬 Newsletter</MobileLink>
            <MobileLink href="/directory"        onClick={closeMobile}>📁 Directory</MobileLink>
            <MobileLink href="/glossary"         onClick={closeMobile}>📖 Glossary</MobileLink>

            <MobileSection label="Company" />
            <MobileLink href="/about"   onClick={closeMobile}>About Us</MobileLink>
            <MobileLink href="/contact" onClick={closeMobile}>Contact Us</MobileLink>
            <MobileLink href="/press"   onClick={closeMobile}>📰 Press &amp; Media Kit</MobileLink>
            <MobileLink href="/submit"  onClick={closeMobile}>➕ Submit Your AI Tool</MobileLink>
          </MobileAccordion>
        </div>
      )}
    </header>
  );
}

function MobileAccordion({ label, open, onToggle, children }: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-semibold text-foreground hover:bg-muted transition-colors"
      >
        {label}
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pl-2 mt-1 space-y-1 pb-2">{children}</div>}
    </div>
  );
}

function MobileSection({ label }: { label: string }) {
  return (
    <p className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-primary">{label}</p>
  );
}

function MobileSubLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 pt-1.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{children}</p>
  );
}

function MobileLink({ href, onClick, children }: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} onClick={onClick} className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
      {children}
    </Link>
  );
}
