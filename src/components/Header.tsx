"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
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

export default function Header() {
  const { data: session } = useSession();
  const isAdminOrContributor = session?.user?.role === "admin" || session?.user?.role === "contributor";

  const compare      = useDropdown();
  const bestFor      = useDropdown();
  const rankings     = useDropdown();
  const alternatives = useDropdown();
  const vs           = useDropdown();
  const live         = useDropdown();
  const business     = useDropdown();
  const market       = useDropdown();
  const tech         = useDropdown();
  const company      = useDropdown();

  const [mobileOpen,              setMobileOpen]              = useState(false);
  const [mobileCompareOpen,       setMobileCompareOpen]       = useState(false);
  const [mobileBestForOpen,       setMobileBestForOpen]       = useState(false);
  const [mobileRankingsOpen,      setMobileRankingsOpen]      = useState(false);
  const [mobileAlternativesOpen,  setMobileAlternativesOpen]  = useState(false);
  const [mobileVsOpen,            setMobileVsOpen]            = useState(false);
  const [mobileLiveOpen,          setMobileLiveOpen]          = useState(false);
  const [mobileBusinessOpen,      setMobileBusinessOpen]      = useState(false);
  const [mobileMarketOpen,        setMobileMarketOpen]        = useState(false);
  const [mobileTechOpen,          setMobileTechOpen]          = useState(false);
  const [mobileCompanyOpen,       setMobileCompanyOpen]       = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

  function closeMobile() {
    setMobileOpen(false);
    setMobileCompareOpen(false);
    setMobileBestForOpen(false);
    setMobileRankingsOpen(false);
    setMobileAlternativesOpen(false);
    setMobileVsOpen(false);
    setMobileLiveOpen(false);
    setMobileBusinessOpen(false);
    setMobileMarketOpen(false);
    setMobileTechOpen(false);
    setMobileCompanyOpen(false);
  }

  const dropdownClass = "absolute top-full left-0 mt-2 w-64 rounded-lg border border-border bg-background shadow-lg py-1 z-50";
  const navBtn = (label: string, open: boolean) => (
    <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
      {label} {chevron(open)}
    </button>
  );
  const sectionLabel = (text: string) => (
    <div className="px-4 py-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{text}</span>
    </div>
  );
  const divider = <div className="my-1 border-t border-border" />;

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center h-full py-1 shrink-0" onClick={closeMobile}>
            <Image src="/logo-light.svg" alt="We Compare AI" width={240} height={52} className="h-9 sm:h-11 w-auto object-contain block dark:hidden" />
            <Image src="/logo-dark.svg"  alt="We Compare AI" width={240} height={52} className="h-9 sm:h-11 w-auto object-contain hidden dark:block" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-5">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap">
              Home
            </Link>

            <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap font-medium">
              Compare Tools
            </Link>

            <Link href="/for" className="text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap font-medium flex items-center gap-1">
              AI by Profession
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold">New</span>
            </Link>

            {/* ── Compare AI ── */}
            <div className="relative" onMouseEnter={compare.onEnter} onMouseLeave={compare.onLeave}>
              {navBtn("Compare AI", compare.open)}
              {compare.open && (
                <div className={dropdownClass}>
                  {sectionLabel("Discover")}
                  <Link href="/search" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">Tool Search <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">New</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Search and compare any 2–5 AI tools side by side</div>
                  </Link>
                  <Link href="/for" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">AI by Profession <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">New</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Best tools for lawyers, doctors, teachers & 12+ more</div>
                  </Link>
                  <Link href="/categories" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">By Category <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Browse all AI comparison categories</div>
                  </Link>
                  <Link href="/domains" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">By Domain <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Healthcare, finance, legal, education & more</div>
                  </Link>
                  <Link href="/countries" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">By Country <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">AI availability & compliance by region</div>
                  </Link>
                  <Link href="/features" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">By Feature <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Find AI tools by specific capability</div>
                  </Link>
                  {divider}
                  {sectionLabel("Analyze")}
                  <Link href="/research/integrations" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">Integration Graphs <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Which AI tools plug into your workflow</div>
                  </Link>
                  <Link href="/research/compliance" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">Security &amp; Compliance <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">SOC 2, HIPAA, GDPR, on-prem comparison</div>
                  </Link>
                  <Link href="/research/cost-per-task" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">💸 Cost-Per-Task Benchmarks <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Real cost to write a blog post, debug code & more</div>
                  </Link>
                  {divider}
                  {sectionLabel("Guides")}
                  <Link href="/research/playbooks" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">📖 Use-Case Playbooks <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Best AI for Students, Coding, Marketing & more</div>
                  </Link>
                  <Link href="/research/model-tracker" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">📡 Model Update Tracker <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Every release, price change & deprecation</div>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Best For ── */}
            <div className="relative" onMouseEnter={bestFor.onEnter} onMouseLeave={bestFor.onLeave}>
              {navBtn("Best For", bestFor.open)}
              {bestFor.open && (
                <div className={dropdownClass}>
                  {sectionLabel("Top Picks by Use Case")}
                  <Link href="/best/coding" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">💻 Best for Coding <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Claude vs Copilot vs Cursor — top 3 picks</div>
                  </Link>
                  <Link href="/best/writing" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">✍️ Best for Writing <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Top AI writing & content creation tools</div>
                  </Link>
                  <Link href="/best/marketing" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">📣 Best for Marketing <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Best AI for campaigns, copy & social media</div>
                  </Link>
                  <Link href="/best/video-generation" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🎬 Best for Video Generation <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Sora vs Runway vs Pika compared</div>
                  </Link>
                  <Link href="/best/startups" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🚀 Best for Startups <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Cost-efficient AI stack for small teams</div>
                  </Link>
                  <Link href="/best/business" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🏢 Best for Business <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Microsoft Copilot vs ChatGPT Team vs Make</div>
                  </Link>
                  <Link href="/best/image-generation" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🎨 Best for Image Generation <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Midjourney vs DALL-E 3 vs Stable Diffusion</div>
                  </Link>
                  <Link href="/best/voice-cloning" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🎙️ Best for Voice Cloning <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">ElevenLabs vs Murf vs Play.ht</div>
                  </Link>
                  {divider}
                  <Link href="/best" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-primary">See all 22 use cases →</div>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Rankings ── */}
            <div className="relative" onMouseEnter={rankings.onEnter} onMouseLeave={rankings.onLeave}>
              {navBtn("Rankings", rankings.open)}
              {rankings.open && (
                <div className={dropdownClass}>
                  {sectionLabel("By Category")}
                  <Link href="/rankings" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🏆 Overall Rankings <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">All tools scored across 4 dimensions</div>
                  </Link>
                  <Link href="/research/llm-leaderboard" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">📊 LLM Leaderboard <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Live benchmark scores across all models</div>
                  </Link>
                  <Link href="/rankings?category=LLM" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🤖 Best LLMs <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">ChatGPT, Claude, Gemini & more ranked</div>
                  </Link>
                  <Link href="/rankings?category=Coding" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">💻 Best Coding Tools <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Cursor, Copilot, Claude Code ranked</div>
                  </Link>
                  <Link href="/rankings?category=Image" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🎨 Best Image Generators <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Midjourney, DALL-E 3, Stable Diffusion</div>
                  </Link>
                  <Link href="/rankings?category=Audio" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🎙️ Best Audio Tools <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">ElevenLabs, Suno & voice AI ranked</div>
                  </Link>
                  <Link href="/rankings?category=Cloud" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">☁️ Best Cloud AI <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">AWS, Azure & GCP AI services ranked</div>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Alternatives ── */}
            <div className="relative" onMouseEnter={alternatives.onEnter} onMouseLeave={alternatives.onLeave}>
              {navBtn("Alternatives", alternatives.open)}
              {alternatives.open && (
                <div className={dropdownClass}>
                  {sectionLabel("By Tool")}
                  <Link href="/alternatives/chatgpt-alternatives" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🤖 ChatGPT Alternatives <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Claude, Gemini, Perplexity & more</div>
                  </Link>
                  <Link href="/alternatives/claude-alternatives" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🧠 Claude Alternatives <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Best alternatives to Claude AI</div>
                  </Link>
                  <Link href="/alternatives/gemini-alternatives" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">✨ Gemini Alternatives <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Best alternatives to Google Gemini</div>
                  </Link>
                  <Link href="/alternatives/github-copilot-alternatives" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">💻 GitHub Copilot Alternatives <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Cursor, Windsurf, Claude Code & more</div>
                  </Link>
                  <Link href="/alternatives/cursor-alternatives" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">⌨️ Cursor Alternatives <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Best AI coding tools vs Cursor</div>
                  </Link>
                  <Link href="/alternatives/midjourney-alternatives" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🎨 Midjourney Alternatives <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">DALL-E 3, Stable Diffusion & more</div>
                  </Link>
                  <Link href="/alternatives/elevenlabs-alternatives" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🎙️ ElevenLabs Alternatives <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Murf, Play.ht, OpenAI TTS & more</div>
                  </Link>
                  <Link href="/alternatives/perplexity-alternatives" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🔬 Perplexity Alternatives <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Best AI search engines vs Perplexity</div>
                  </Link>
                  {divider}
                  <Link href="/alternatives" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-primary">See all alternatives →</div>
                  </Link>
                </div>
              )}
            </div>

            {/* ── VS ── */}
            <div className="relative" onMouseEnter={vs.onEnter} onMouseLeave={vs.onLeave}>
              {navBtn("VS", vs.open)}
              {vs.open && (
                <div className={dropdownClass}>
                  {sectionLabel("🤖 AI Models")}
                  <Link href="/vs/chatgpt-vs-claude" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">ChatGPT vs Claude <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">GPT-4o vs Claude Opus 4</div>
                  </Link>
                  <Link href="/vs/chatgpt-vs-gemini" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">ChatGPT vs Gemini <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">GPT-4o vs Gemini 2.5 Pro</div>
                  </Link>
                  <Link href="/vs/claude-vs-gemini" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">Claude vs Gemini <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                  </Link>
                  <Link href="/vs/deepseek-vs-chatgpt" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">DeepSeek vs ChatGPT <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                  </Link>
                  {divider}
                  {sectionLabel("💻 Coding Tools")}
                  <Link href="/vs/copilot-vs-cursor" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">Copilot vs Cursor <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                  </Link>
                  <Link href="/vs/cursor-vs-windsurf" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">Cursor vs Windsurf <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                  </Link>
                  <Link href="/vs/claude-code-vs-copilot" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">Claude Code vs Copilot <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                  </Link>
                  {divider}
                  {sectionLabel("🎨 Image & 🎬 Video")}
                  <Link href="/vs/midjourney-vs-dalle" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">Midjourney vs DALL-E 3 <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                  </Link>
                  <Link href="/vs/sora-vs-runway" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">Sora vs Runway Gen-3 <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                  </Link>
                  {divider}
                  <Link href="/vs" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-primary">See all 28 comparisons →</div>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Live Tools ── */}
            <div className="relative" onMouseEnter={live.onEnter} onMouseLeave={live.onLeave}>
              {navBtn("Live Tools", live.open)}
              {live.open && (
                <div className={dropdownClass}>
                  <Link href="/research/compare" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">Compare AI Models Live <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20 shrink-0">Premium</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Run a prompt across ChatGPT, Claude & Gemini</div>
                  </Link>
                  <Link href="/research/benchmark" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">Real-Time Benchmarking <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20 shrink-0">Premium</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Speed, cost, tokens & performance charts</div>
                  </Link>
                  <Link href="/research/finder" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">AI Tool Finder <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20 shrink-0">Premium</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Answer 6 questions, get your perfect AI stack</div>
                  </Link>
                  <Link href="/research/prompt-battle" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">⚔️ Prompt Battle <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20 shrink-0">Premium</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">6 models, one prompt, instant comparison</div>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Business Tools ── */}
            <div className="relative" onMouseEnter={business.onEnter} onMouseLeave={business.onLeave}>
              {navBtn("Business Tools", business.open)}
              {business.open && (
                <div className={dropdownClass}>
                  <Link href="/research/roi-calculator" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">💰 AI ROI Calculator <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20 shrink-0">Premium</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Time saved, cost saved, payback period</div>
                  </Link>
                  <Link href="/research/workflow-builder" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🔧 AI Workflow Builder <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20 shrink-0">Premium</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Build AI pipelines with drag & drop</div>
                  </Link>
                  <Link href="/research/procurement" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">📋 Procurement Assistant <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20 shrink-0">Premium</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Generate RFPs, compare vendors, export checklists</div>
                  </Link>
                  <Link href="/research/ai-stack" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🧩 Your AI Stack <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20 shrink-0">Premium</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Personalized tool stack by role & budget</div>
                  </Link>
                  <Link href="/research/migration" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🔄 Migration Assistant <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20 shrink-0">Premium</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Switch models — cost diff, effort, code snippets</div>
                  </Link>
                  <Link href="/research/data-governance" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🔒 Data Governance Simulator <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20 shrink-0">Premium</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Toggle region, PII & compliance — see who passes</div>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Market Intelligence ── */}
            <div className="relative" onMouseEnter={market.onEnter} onMouseLeave={market.onLeave}>
              {navBtn("Market Intelligence", market.open)}
              {market.open && (
                <div className={dropdownClass}>
                  <Link href="/research/market-share" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">📊 Market Share Dashboard <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Consumer, enterprise & developer usage trends</div>
                  </Link>
                  <Link href="/research/pricing-index" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">💲 AI Pricing Index <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Token prices, subscriptions & recent changes</div>
                  </Link>
                  <Link href="/research/vendor-risk" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🛡️ Vendor Risk Score <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Funding, compliance & outage risk per vendor</div>
                  </Link>
                  <Link href="/research/dependency-graph" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🕸️ Dependency Graph <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Which apps rely on which models & infra</div>
                  </Link>
                </div>
              )}
            </div>

            {/* ── Company ── */}
            <div className="relative" onMouseEnter={company.onEnter} onMouseLeave={company.onLeave}>
              {navBtn("Company", company.open)}
              {company.open && (
                <div className={dropdownClass}>
                  {sectionLabel("Company")}
                  <Link href="/about"   className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">About Us <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                  </Link>
                  <Link href="/contact" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">Contact Us <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                  </Link>
                  <Link href="/press" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">📰 Press & Media Kit <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Logos, stats & media contact</div>
                  </Link>
                  <Link href="/submit" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">➕ Submit Your AI Tool <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Get listed on We Compare AI</div>
                  </Link>
                  {divider}
                  {sectionLabel("Technical")}
                  <Link href="/research/latency-heatmap" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🌍 Latency Heatmap <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Model speed by US, EU & Asia region</div>
                  </Link>
                  <Link href="/research/reasoning-tests" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">🧪 Reasoning Stress Tests <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Multi-step, code, long-context & tool-use scores</div>
                  </Link>
                  {divider}
                  {sectionLabel("Content")}
                  <Link href="/blog" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">✍️ Blog <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">AI news, guides & deep dives</div>
                  </Link>
                  <Link href="/research/ai-news" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">📡 AI News Digest <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Weekly pricing & model release updates</div>
                  </Link>
                  <Link href="/newsletter" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">📬 Newsletter <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Weekly digest every Thursday</div>
                  </Link>
                  <Link href="/directory" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">📁 Directory <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">Browse all AI tools in one place</div>
                  </Link>
                  <Link href="/glossary" className="block px-4 py-2 text-sm hover:bg-muted transition-colors">
                    <div className="font-medium text-foreground flex items-center justify-between gap-2">📖 Glossary <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">Free</span></div>
                    <div className="text-xs text-muted-foreground mt-0.5">AI terms, concepts & definitions explained</div>
                  </Link>
                </div>
              )}
            </div>

            <AuthButton />
          </nav>

          {/* Mobile: auth + hamburger */}
          <div className="flex items-center gap-3 md:hidden">
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
        <div className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
          <Link href="/" onClick={closeMobile} className="block px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            Home
          </Link>

          <MobileLink href="/search" onClick={closeMobile}>
            <span className="font-semibold text-foreground">Compare Tools</span>
            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">New</span>
          </MobileLink>

          {/* Compare AI */}
          <MobileAccordion label="Compare AI" open={mobileCompareOpen} onToggle={() => setMobileCompareOpen(v => !v)}>
            <p className="px-3 pt-1 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Discover</p>
            <MobileLink href="/search"      onClick={closeMobile}>🔍 Tool Search (New)</MobileLink>
            <MobileLink href="/for"         onClick={closeMobile}>👤 AI by Profession (New)</MobileLink>
            <MobileLink href="/categories"  onClick={closeMobile}>By Category</MobileLink>
            <MobileLink href="/domains"     onClick={closeMobile}>By Domain</MobileLink>
            <MobileLink href="/countries"   onClick={closeMobile}>By Country</MobileLink>
            <MobileLink href="/features"    onClick={closeMobile}>By Feature</MobileLink>
            <p className="px-3 pt-2 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Analyze</p>
            <MobileLink href="/research/integrations" onClick={closeMobile}>Integration Graphs</MobileLink>
            <MobileLink href="/research/compliance"   onClick={closeMobile}>Security &amp; Compliance</MobileLink>
            <MobileLink href="/research/cost-per-task" onClick={closeMobile}>💸 Cost-Per-Task Benchmarks</MobileLink>
            <p className="px-3 pt-2 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Guides</p>
            <MobileLink href="/research/playbooks"     onClick={closeMobile}>📖 Use-Case Playbooks</MobileLink>
            <MobileLink href="/research/model-tracker" onClick={closeMobile}>📡 Model Update Tracker</MobileLink>
          </MobileAccordion>

          {/* Rankings */}
          <MobileAccordion label="Rankings" open={mobileRankingsOpen} onToggle={() => setMobileRankingsOpen(v => !v)}>
            <MobileLink href="/rankings"                       onClick={closeMobile}>🏆 Overall Rankings</MobileLink>
            <MobileLink href="/research/llm-leaderboard"       onClick={closeMobile}>📊 LLM Leaderboard</MobileLink>
            <MobileLink href="/rankings?category=LLM"          onClick={closeMobile}>🤖 Best LLMs</MobileLink>
            <MobileLink href="/rankings?category=Coding"  onClick={closeMobile}>💻 Best Coding Tools</MobileLink>
            <MobileLink href="/rankings?category=Image"   onClick={closeMobile}>🎨 Best Image Generators</MobileLink>
            <MobileLink href="/rankings?category=Audio"   onClick={closeMobile}>🎙️ Best Audio Tools</MobileLink>
            <MobileLink href="/rankings?category=Cloud"   onClick={closeMobile}>☁️ Best Cloud AI</MobileLink>
          </MobileAccordion>

          {/* Alternatives */}
          <MobileAccordion label="Alternatives" open={mobileAlternativesOpen} onToggle={() => setMobileAlternativesOpen(v => !v)}>
            <MobileLink href="/alternatives/chatgpt-alternatives"       onClick={closeMobile}>🤖 ChatGPT Alternatives</MobileLink>
            <MobileLink href="/alternatives/claude-alternatives"        onClick={closeMobile}>🧠 Claude Alternatives</MobileLink>
            <MobileLink href="/alternatives/gemini-alternatives"        onClick={closeMobile}>✨ Gemini Alternatives</MobileLink>
            <MobileLink href="/alternatives/github-copilot-alternatives" onClick={closeMobile}>💻 GitHub Copilot Alternatives</MobileLink>
            <MobileLink href="/alternatives/cursor-alternatives"        onClick={closeMobile}>⌨️ Cursor Alternatives</MobileLink>
            <MobileLink href="/alternatives/midjourney-alternatives"    onClick={closeMobile}>🎨 Midjourney Alternatives</MobileLink>
            <MobileLink href="/alternatives/elevenlabs-alternatives"    onClick={closeMobile}>🎙️ ElevenLabs Alternatives</MobileLink>
            <MobileLink href="/alternatives/perplexity-alternatives"    onClick={closeMobile}>🔬 Perplexity Alternatives</MobileLink>
            <MobileLink href="/alternatives"                            onClick={closeMobile}>See all alternatives →</MobileLink>
          </MobileAccordion>

          {/* VS */}
          <MobileAccordion label="VS Comparisons" open={mobileVsOpen} onToggle={() => setMobileVsOpen(v => !v)}>
            <p className="px-3 pt-1 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">AI Models</p>
            <MobileLink href="/vs/chatgpt-vs-claude"       onClick={closeMobile}>ChatGPT vs Claude</MobileLink>
            <MobileLink href="/vs/chatgpt-vs-gemini"       onClick={closeMobile}>ChatGPT vs Gemini</MobileLink>
            <MobileLink href="/vs/claude-vs-gemini"        onClick={closeMobile}>Claude vs Gemini</MobileLink>
            <MobileLink href="/vs/deepseek-vs-chatgpt"     onClick={closeMobile}>DeepSeek vs ChatGPT</MobileLink>
            <p className="px-3 pt-2 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Coding Tools</p>
            <MobileLink href="/vs/copilot-vs-cursor"       onClick={closeMobile}>Copilot vs Cursor</MobileLink>
            <MobileLink href="/vs/cursor-vs-windsurf"      onClick={closeMobile}>Cursor vs Windsurf</MobileLink>
            <MobileLink href="/vs/claude-code-vs-copilot"  onClick={closeMobile}>Claude Code vs Copilot</MobileLink>
            <p className="px-3 pt-2 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Image & Video</p>
            <MobileLink href="/vs/midjourney-vs-dalle"     onClick={closeMobile}>Midjourney vs DALL-E 3</MobileLink>
            <MobileLink href="/vs/sora-vs-runway"          onClick={closeMobile}>Sora vs Runway Gen-3</MobileLink>
            <MobileLink href="/vs"                         onClick={closeMobile}>See all 28 comparisons →</MobileLink>
          </MobileAccordion>

          {/* Best For */}
          <MobileAccordion label="Best For" open={mobileBestForOpen} onToggle={() => setMobileBestForOpen(v => !v)}>
            <MobileLink href="/best/coding"            onClick={closeMobile}>💻 Best for Coding</MobileLink>
            <MobileLink href="/best/writing"           onClick={closeMobile}>✍️ Best for Writing</MobileLink>
            <MobileLink href="/best/marketing"         onClick={closeMobile}>📣 Best for Marketing</MobileLink>
            <MobileLink href="/best/video-generation"  onClick={closeMobile}>🎬 Best for Video Generation</MobileLink>
            <MobileLink href="/best/startups"          onClick={closeMobile}>🚀 Best for Startups</MobileLink>
            <MobileLink href="/best/business"          onClick={closeMobile}>🏢 Best for Business</MobileLink>
            <MobileLink href="/best/image-generation"  onClick={closeMobile}>🎨 Best for Image Generation</MobileLink>
            <MobileLink href="/best/voice-cloning"     onClick={closeMobile}>🎙️ Best for Voice Cloning</MobileLink>
            <MobileLink href="/best/social-media"      onClick={closeMobile}>📱 Best for Social Media</MobileLink>
            <MobileLink href="/best/students"          onClick={closeMobile}>🎓 Best for Students</MobileLink>
            <MobileLink href="/best"                   onClick={closeMobile}>See all 22 use cases →</MobileLink>
          </MobileAccordion>

          <MobileAccordion label="Live Tools" open={mobileLiveOpen} onToggle={() => setMobileLiveOpen(v => !v)}>
            <MobileLink href="/research/compare"      onClick={closeMobile}>Compare AI Models Live</MobileLink>
            <MobileLink href="/research/benchmark"    onClick={closeMobile}>Real-Time Benchmarking</MobileLink>
            <MobileLink href="/research/finder"       onClick={closeMobile}>AI Tool Finder</MobileLink>
            <MobileLink href="/research/prompt-battle" onClick={closeMobile}>⚔️ Prompt Battle</MobileLink>
          </MobileAccordion>

          <MobileAccordion label="Business Tools" open={mobileBusinessOpen} onToggle={() => setMobileBusinessOpen(v => !v)}>
            <MobileLink href="/research/roi-calculator"   onClick={closeMobile}>💰 AI ROI Calculator</MobileLink>
            <MobileLink href="/research/workflow-builder" onClick={closeMobile}>🔧 AI Workflow Builder</MobileLink>
            <MobileLink href="/research/procurement"      onClick={closeMobile}>📋 Procurement Assistant</MobileLink>
            <MobileLink href="/research/ai-stack"         onClick={closeMobile}>🧩 Your AI Stack</MobileLink>
            <MobileLink href="/research/migration"        onClick={closeMobile}>🔄 Migration Assistant</MobileLink>
            <MobileLink href="/research/data-governance"  onClick={closeMobile}>🔒 Data Governance Simulator</MobileLink>
          </MobileAccordion>

          <MobileAccordion label="Market Intelligence" open={mobileMarketOpen} onToggle={() => setMobileMarketOpen(v => !v)}>
            <MobileLink href="/research/market-share"     onClick={closeMobile}>📊 Market Share Dashboard</MobileLink>
            <MobileLink href="/research/pricing-index"    onClick={closeMobile}>💲 AI Pricing Index</MobileLink>
            <MobileLink href="/research/vendor-risk"      onClick={closeMobile}>🛡️ Vendor Risk Score</MobileLink>
            <MobileLink href="/research/dependency-graph" onClick={closeMobile}>🕸️ Dependency Graph</MobileLink>
          </MobileAccordion>

          {/* Company */}
          <MobileAccordion label="Company" open={mobileCompanyOpen} onToggle={() => setMobileCompanyOpen(v => !v)}>
            <MobileLink href="/about"   onClick={closeMobile}>About Us</MobileLink>
            <MobileLink href="/contact" onClick={closeMobile}>Contact Us</MobileLink>
            <MobileLink href="/press"   onClick={closeMobile}>📰 Press & Media Kit</MobileLink>
            <MobileLink href="/submit"  onClick={closeMobile}>➕ Submit Your AI Tool</MobileLink>
            <p className="px-3 pt-2 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Technical</p>
            <MobileLink href="/research/latency-heatmap"  onClick={closeMobile}>🌍 Latency Heatmap</MobileLink>
            <MobileLink href="/research/reasoning-tests"  onClick={closeMobile}>🧪 Reasoning Stress Tests</MobileLink>
            <p className="px-3 pt-2 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Content</p>
            <MobileLink href="/blog"                      onClick={closeMobile}>✍️ Blog</MobileLink>
            <MobileLink href="/research/ai-news"          onClick={closeMobile}>📡 AI News Digest</MobileLink>
            <MobileLink href="/newsletter"                onClick={closeMobile}>📬 Newsletter</MobileLink>
            <MobileLink href="/directory"                 onClick={closeMobile}>📁 Directory</MobileLink>
            <MobileLink href="/glossary"                  onClick={closeMobile}>📖 Glossary</MobileLink>
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
        className="flex items-center justify-between w-full px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        {label}
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && <div className="pl-4 mt-1 space-y-1">{children}</div>}
    </div>
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
