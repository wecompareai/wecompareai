import { Metadata } from "next";
import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata: Metadata = {
  title: "Our Methodology — How We Compare AI Tools",
  description:
    "Learn how We Compare AI collects, scores, and updates data on 100+ AI tools. Our transparent methodology covers pricing, benchmarks, compliance, and more.",
  alternates: { canonical: `${SITE_URL}/methodology` },
  openGraph: {
    title: "Our Methodology | We Compare AI",
    description: "Transparent, independent, and updated in real-time. Here's exactly how we compare AI tools.",
    url: `${SITE_URL}/methodology`,
    siteName: "We Compare AI",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const PRINCIPLES = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    title: "Zero Vendor Bias",
    desc: "We are not paid by any AI company to appear in our comparisons. No sponsored rankings, no pay-to-win placements. Every tool is evaluated on the same criteria.",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Real-Time Updates",
    desc: "Our autonomous AI agents monitor vendor documentation, pricing pages, and official announcements continuously. Data is refreshed as soon as changes are detected — not monthly, not weekly.",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Source Verification",
    desc: "Every data point is traced to a primary source: official pricing pages, vendor documentation, published research papers, or independently verified benchmarks. We do not copy from other directories.",
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    title: "Full Transparency",
    desc: "We show our work. Every comparison page shows when data was last updated. This page explains exactly how we collect and score information. If we're uncertain about a data point, we say so.",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
];

const DATA_SOURCES = [
  { label: "Official Pricing Pages", desc: "We pull pricing directly from vendor websites, not third-party summaries." },
  { label: "Official Documentation", desc: "Model specs, context windows, rate limits sourced from vendor API docs." },
  { label: "Published Benchmarks", desc: "We reference MMLU, HumanEval, HELM, MT-Bench, and Chatbot Arena for performance data." },
  { label: "Compliance Certificates", desc: "SOC 2, HIPAA BAA, ISO 27001 status verified against vendor trust portals." },
  { label: "Independent Latency Testing", desc: "Response times measured via direct API calls from US, EU, and APAC regions." },
  { label: "SEC/Funding Filings", desc: "Vendor risk scores incorporate publicly available funding rounds and financial filings." },
];

const UPDATE_PROCESS = [
  { step: "1", title: "AI Agents Monitor Sources", desc: "Autonomous agents check official pricing pages, documentation, and release notes continuously for changes." },
  { step: "2", title: "Change Detection", desc: "When a change is detected (e.g. a price update, new model release, or compliance cert change), a flag is raised." },
  { step: "3", title: "Human Review (for major changes)", desc: "Significant changes — new model launches, major pricing shifts — are reviewed by our team before publishing." },
  { step: "4", title: "Timestamp Updated", desc: "Every comparison page shows the exact date the data was last verified. You always know how fresh the information is." },
  { step: "5", title: "Blog Agent Publishes", desc: "Our daily blog agent automatically publishes articles about notable changes, keeping users informed without manual effort." },
];

const WHAT_WE_DO_NOT_DO = [
  "Accept payment for higher rankings or 'featured' placement",
  "Copy data from other directories without independent verification",
  "Publish benchmarks we cannot trace to a primary source",
  "Leave stale data live without a visible 'last updated' date",
  "Make claims about tools we have not independently reviewed",
];

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

      {/* Hero */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Methodology</span>
        </div>
        <h1 className="text-4xl font-bold text-foreground">Our Methodology</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          We Compare AI tracks 100+ AI tools across 1,000+ data points. Here is exactly how we collect that data,
          how we keep it current, and what we will never do.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Updated in real-time by AI agents
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20 font-medium">
            100+ tools tracked
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/20 font-medium">
            Zero vendor sponsorships
          </span>
        </div>
      </div>

      {/* Core Principles */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Core Principles</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="rounded-xl border border-border bg-card p-5 space-y-3">
              <div className={`w-9 h-9 rounded-lg ${p.bg} ${p.color} flex items-center justify-center`}>
                {p.icon}
              </div>
              <h3 className="font-semibold text-foreground">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Sources */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Where Our Data Comes From</h2>
          <p className="text-sm text-muted-foreground mt-1">Every data point is traceable to one of these primary sources.</p>
        </div>
        <div className="rounded-xl border border-border overflow-hidden">
          {DATA_SOURCES.map((source, i) => (
            <div key={source.label} className={`px-5 py-4 flex items-start gap-4 ${i < DATA_SOURCES.length - 1 ? "border-b border-border" : ""}`}>
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <div className="font-medium text-sm text-foreground">{source.label}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{source.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Update Process */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">How We Keep Data Current</h2>
          <p className="text-sm text-muted-foreground mt-1">Our update pipeline runs continuously, 24 hours a day.</p>
        </div>
        <div className="space-y-4">
          {UPDATE_PROCESS.map((step) => (
            <div key={step.step} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                {step.step}
              </div>
              <div className="flex-1 pt-1">
                <div className="font-medium text-foreground">{step.title}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What We Cover */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">What We Track</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { label: "Pricing & Token Costs", detail: "Input/output token pricing, subscription tiers, free tier limits" },
            { label: "Performance Benchmarks", detail: "MMLU, HumanEval, MT-Bench, Chatbot Arena ELO scores" },
            { label: "Latency by Region", detail: "Response times from US East, US West, EU, and Asia Pacific" },
            { label: "Compliance Certifications", detail: "SOC 2 Type II, HIPAA BAA, GDPR, ISO 27001, FedRAMP" },
            { label: "Context Window", detail: "Maximum token input per request, including long-context variants" },
            { label: "Integrations", detail: "Native connectors, API availability, Zapier/Make.com support" },
            { label: "Vendor Risk Signals", detail: "Funding stability, outage history, dependency concentration" },
            { label: "Model Updates & Deprecations", detail: "Release dates, version changes, end-of-life notices" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-border bg-card px-4 py-3">
              <div className="font-medium text-sm text-foreground">{item.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{item.detail}</div>
            </div>
          ))}
        </div>
      </section>

      {/* What We Never Do */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">What We Will Never Do</h2>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
          <ul className="space-y-3">
            {WHAT_WE_DO_NOT_DO.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                <svg className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Report an Error */}
      <section className="rounded-xl border border-border bg-muted/40 px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Found an error in our data?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            We take accuracy seriously. If you spot outdated or incorrect information, please let us know and we will fix it within 24 hours.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Report an error →
        </Link>
      </section>

    </div>
  );
}
