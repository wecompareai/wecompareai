import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "Press & Media Kit | We Compare AI",
  description:
    "Press resources, logos, key statistics, and media contact for We Compare AI — the independent AI model & pricing comparison platform.",
  alternates: { canonical: `${SITE_URL}/press` },
  openGraph: {
    title: "Press & Media Kit | We Compare AI",
    description: "Media resources for We Compare AI — logos, stats, and press contact.",
    url: `${SITE_URL}/press`,
    siteName: "We Compare AI",
    type: "website",
  },
};

const STATS = [
  { value: "100+", label: "AI tools tracked" },
  { value: "280+", label: "Indexed comparison pages" },
  { value: "1,000+", label: "Data points per tool" },
  { value: "28", label: "Head-to-head VS pages" },
  { value: "43", label: "Glossary terms" },
  { value: "Real-time", label: "Pricing & benchmark updates" },
];

const COVERAGE_CATEGORIES = [
  "Large Language Models (LLMs)",
  "AI Coding Tools",
  "Image Generators",
  "Video Generators",
  "Voice & Audio AI",
  "Music Generation AI",
  "Cloud AI Platforms (AWS, Azure, GCP)",
  "AI Compliance & Security",
  "AI Pricing & Token Costs",
  "AI Chip & Hardware Providers",
];

const FOUNDERS = [
  {
    name: "Jigar Acharya",
    role: "Co-founder & Solution Architect",
    bio: "20+ years in enterprise technology and solution architecture. Expert in AI integration, cloud platforms, and enterprise digital transformation.",
    expertise: ["Enterprise AI", "Solution Architecture", "Cloud Platforms", "AI Integration"],
  },
  {
    name: "Saurabh Gera",
    role: "Co-founder, Infrastructure Architect & Director",
    bio: "15+ years in infrastructure architecture and technology leadership. Specialist in AI infrastructure, DevOps, and scalable platform engineering.",
    expertise: ["Infrastructure Architecture", "DevOps", "AI Platforms", "Technology Strategy"],
  },
];

export default function PressPage() {
  return (
    <div className="py-8 sm:py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Breadcrumb */}
        <nav className="mb-5 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Press</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Press & Media Kit</h1>
          <p className="text-base text-muted-foreground max-w-2xl">
            Resources for journalists, analysts, and content creators covering AI tools and the enterprise AI market.
          </p>
        </div>

        {/* ── About ── */}
        <section className="mb-10 rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground mb-3">About We Compare AI</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            We Compare AI is an independent AI model and pricing comparison platform — the most accurate resource for comparing ChatGPT, Claude, Gemini, and 100+ other AI tools across Performance, Value, Reliability, and Ease of Use.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            Founded in 2025 by Jigar Acharya and Saurabh Gera, the platform serves developers, startups, and enterprise AI teams making purchase decisions. All data is collected independently — we are not paid by any AI company to rank their products.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Positioning:</strong> "The most accurate AI model and pricing comparison platform" — analogous to Bloomberg for financial data, but for AI tools.
          </p>
        </section>

        {/* ── Key Stats ── */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-foreground mb-4">Key Statistics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-2xl font-extrabold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Coverage ── */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-foreground mb-4">What We Cover</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {COVERAGE_CATEGORIES.map((cat) => (
              <div key={cat} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="text-primary shrink-0">✓</span>
                {cat}
              </div>
            ))}
          </div>
        </section>

        {/* ── Founders ── */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-foreground mb-4">Founders & Spokespeople</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {FOUNDERS.map((f) => (
              <div key={f.name} className="rounded-xl border border-border bg-card p-5">
                <p className="font-semibold text-foreground">{f.name}</p>
                <p className="text-xs text-primary mt-0.5 mb-3">{f.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{f.bio}</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.expertise.map((e) => (
                    <span key={e} className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground">{e}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Brand assets ── */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-foreground mb-4">Brand Assets</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-white dark:bg-zinc-900 p-6 flex items-center justify-center min-h-[100px]">
              <p className="text-lg font-bold text-foreground">We Compare AI</p>
            </div>
            <div className="rounded-xl border border-border bg-zinc-900 dark:bg-zinc-950 p-6 flex items-center justify-center min-h-[100px]">
              <p className="text-lg font-bold text-white">We Compare AI</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <div className="rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground">
              <p className="font-medium text-foreground text-xs mb-1">Brand Colours</p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-primary" />
                <span className="font-mono text-xs">Primary</span>
                <div className="w-4 h-4 rounded-full bg-emerald-500" />
                <span className="font-mono text-xs">#10b981</span>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground">
              <p className="font-medium text-foreground text-xs mb-1">Full Name</p>
              <p className="font-mono text-xs">We Compare AI</p>
            </div>
            <div className="rounded-lg border border-border bg-muted px-4 py-2.5 text-sm text-muted-foreground">
              <p className="font-medium text-foreground text-xs mb-1">Domain</p>
              <p className="font-mono text-xs">wecompareai.com</p>
            </div>
          </div>
        </section>

        {/* ── Key claims ── */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-foreground mb-4">Approved Descriptions</h2>
          <div className="space-y-3">
            {[
              { length: "Short (10 words)", text: "The most accurate AI model and pricing comparison platform." },
              { length: "Medium (25 words)", text: "We Compare AI is an independent platform tracking 100+ AI tools across pricing, benchmarks, compliance, and integrations — updated in real-time by AI agents." },
              { length: "Long (50 words)", text: "We Compare AI is the most accurate AI comparison platform, independently ranking ChatGPT, Claude, Gemini, and 100+ other tools across Performance, Value, Reliability, and Ease of Use. Founded by enterprise technology veterans Jigar Acharya and Saurabh Gera, the platform serves developers, startups, and enterprise AI teams making purchase decisions." },
            ].map((d) => (
              <div key={d.length} className="rounded-lg border border-border bg-card p-4">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">{d.length}</p>
                <p className="text-sm text-foreground leading-relaxed">{d.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Media Contact ── */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
          <h2 className="text-base font-semibold text-foreground mb-1">Media Contact</h2>
          <p className="text-xs text-muted-foreground mb-4">
            For press enquiries, interview requests, and data licensing:
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-foreground"><strong>Email:</strong> <a href="mailto:press@wecompareai.com" className="text-primary hover:underline">press@wecompareai.com</a></p>
            <p className="text-foreground"><strong>Response time:</strong> Within 2 business days</p>
          </div>
          <div className="mt-4">
            <Link href="/contact" className="inline-flex items-center gap-2 text-sm px-5 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold">
              Send press enquiry →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
