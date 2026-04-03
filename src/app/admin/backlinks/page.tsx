"use client";

import { useState, useEffect } from "react";

const SITE_NAME = "We Compare AI";
const SITE_URL = "https://wecompareai.com";
const SHORT_TAGLINE = "Compare Every AI Tool, Model & Platform Side by Side";
const ONE_LINER = "The #1 free site to compare 100+ AI tools — pricing, features, compliance & benchmarks.";
const FULL_DESCRIPTION = `We Compare AI is the most comprehensive independent AI comparison platform on the internet. Compare ChatGPT vs Claude vs Gemini, AI coding tools, image generators, voice tools, cloud providers, and 100+ AI services — all in one place, completely free.

Key features:
• Side-by-side comparison tables for 100+ AI tools
• Live AI model benchmarking (speed, cost, accuracy)
• AI pricing index — updated in real-time by AI agents
• Security & compliance checker (SOC 2, HIPAA, GDPR)
• AI Tool Finder — answer 6 questions, get your perfect stack
• Prompt Battle — test 6 models with one prompt simultaneously
• ROI Calculator — calculate time and cost savings from AI
• Integration matrix — which AI tools plug into Zapier, Slack, Notion, and more
• Market share dashboard, vendor risk scores, latency heatmaps
• Use-case playbooks for students, developers, marketers, and enterprises

100% independent. No vendor bias. Updated every second by autonomous AI agents.`;
const TAGS = "AI comparison, compare AI models, ChatGPT vs Claude, AI tools, LLM comparison, AI pricing, AI benchmarks, GPT-4o, Claude, Gemini, AI productivity";
const CATEGORY = "AI Tools / Productivity / Research / Technology";

const DIRECTORIES = [
  { id: "theresanaiforthat", name: "There's An AI For That", url: "https://theresanaiforthat.com/submit", da: 72, notes: "High DA, AI-specific, free" },
  { id: "toolify", name: "Toolify.ai", url: "https://www.toolify.ai/submit-ai-tool", da: 55, notes: "Free listing" },
  { id: "topai", name: "TopAI.tools", url: "https://topai.tools/submit", da: 48, notes: "Free listing" },
  { id: "aitoolsdirectory", name: "AI Tools Directory", url: "https://aitoolsdirectory.com/submit", da: 45, notes: "Free listing" },
  { id: "alternativeto", name: "AlternativeTo", url: "https://alternativeto.net/software/add/", da: 82, notes: "High DA, free" },
  { id: "producthunt", name: "Product Hunt", url: "https://www.producthunt.com/posts/new", da: 91, notes: "Highest impact, free" },
  { id: "g2", name: "G2", url: "https://sell.g2.com/free-listing", da: 89, notes: "High DA, free basic" },
  { id: "capterra", name: "Capterra", url: "https://vendors.capterra.com/products/new", da: 88, notes: "Free basic listing" },
  { id: "hackernews", name: "Hacker News (Show HN)", url: "https://news.ycombinator.com/submit", da: 93, notes: "Massive traffic potential" },
  { id: "reddit", name: "Reddit r/artificial", url: "https://www.reddit.com/r/artificial/submit", da: 95, notes: "Huge AI community" },
];

const FIELDS = [
  { label: "Site Name", value: SITE_NAME },
  { label: "Website URL", value: SITE_URL },
  { label: "Short Tagline (60 chars)", value: SHORT_TAGLINE },
  { label: "One-liner (100 chars)", value: ONE_LINER },
  { label: "Category", value: CATEGORY },
  { label: "Tags", value: TAGS },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className={`shrink-0 text-xs px-2.5 py-1 rounded-md border transition-all ${
        copied
          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
          : "bg-muted text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
      }`}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

export default function BacklinksPage() {
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("backlink_submitted");
    if (saved) setSubmitted(JSON.parse(saved));
  }, []);

  function toggleSubmitted(id: string) {
    const next = { ...submitted, [id]: !submitted[id] };
    setSubmitted(next);
    localStorage.setItem("backlink_submitted", JSON.stringify(next));
  }

  const doneCount = Object.values(submitted).filter(Boolean).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Backlink Submission Tracker</h1>
        <p className="text-sm text-muted-foreground">
          Submit We Compare AI to these directories to build backlinks and improve Google ranking.
          Each submission takes ~5 minutes. Progress is saved in your browser.
        </p>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(doneCount / DIRECTORIES.length) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-foreground">{doneCount}/{DIRECTORIES.length} submitted</span>
        </div>
      </div>

      {/* Copy Fields */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <h2 className="text-sm font-semibold text-foreground">Your Submission Copy — Use These On Every Site</h2>
        <div className="space-y-3">
          {FIELDS.map((field) => (
            <div key={field.label} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">{field.label}</span>
                <CopyButton text={field.value} />
              </div>
              <div className="text-sm text-foreground bg-muted/50 rounded-lg px-3 py-2 border border-border">
                {field.value}
              </div>
            </div>
          ))}

          {/* Full Description */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Full Description (paste in "About" / "Description" field)</span>
              <CopyButton text={FULL_DESCRIPTION} />
            </div>
            <div className="text-sm text-foreground bg-muted/50 rounded-lg px-3 py-2 border border-border whitespace-pre-line max-h-40 overflow-y-auto">
              {FULL_DESCRIPTION}
            </div>
          </div>
        </div>
      </div>

      {/* Directory List */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Directories</h2>
        {DIRECTORIES.map((dir) => (
          <div
            key={dir.id}
            className={`rounded-xl border transition-all ${
              submitted[dir.id] ? "border-emerald-500/30 bg-emerald-500/5" : "border-border bg-card"
            }`}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              {/* Checkbox */}
              <button
                onClick={() => toggleSubmitted(dir.id)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                  submitted[dir.id]
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-border hover:border-primary"
                }`}
              >
                {submitted[dir.id] && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-medium text-sm ${submitted[dir.id] ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {dir.name}
                  </span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20">
                    DA {dir.da}
                  </span>
                  <span className="text-xs text-muted-foreground">{dir.notes}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setExpanded(expanded === dir.id ? null : dir.id)}
                  className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border hover:border-primary/40 transition-colors"
                >
                  {expanded === dir.id ? "Hide tips" : "Tips"}
                </button>
                <a
                  href={dir.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
                >
                  Open →
                </a>
              </div>
            </div>

            {/* Expanded tips */}
            {expanded === dir.id && (
              <div className="px-4 pb-3 pt-0 border-t border-border mt-0">
                <DirectoryTips id={dir.id} />
              </div>
            )}
          </div>
        ))}
      </div>

      {doneCount === DIRECTORIES.length && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-5 py-4 text-center">
          <div className="text-2xl mb-1">🎉</div>
          <div className="font-semibold text-emerald-700 dark:text-emerald-400">All directories submitted!</div>
          <div className="text-sm text-muted-foreground mt-1">
            Backlinks typically appear in Google within 2–4 weeks after approval.
          </div>
        </div>
      )}
    </div>
  );
}

function DirectoryTips({ id }: { id: string }) {
  const tips: Record<string, string[]> = {
    theresanaiforthat: [
      "Sign up with Google for fastest approval",
      "Select category: 'Research & Analysis'",
      "Upload a screenshot of the homepage (1280×800px)",
      "Approval usually takes 24–48 hours",
    ],
    toolify: [
      "Select 'Productivity' as primary category",
      "Add 'AI Comparison' and 'Research' as tags",
      "Free listing gets reviewed within 3–5 days",
    ],
    topai: [
      "Select 'AI Tools' category",
      "Paste the full description in the 'About' field",
      "Add your logo from wecompareai.com/logo-light.svg",
    ],
    aitoolsdirectory: [
      "Use the one-liner as the short description",
      "Use the full description for the long description field",
      "Category: 'AI Research Tools'",
    ],
    alternativeto: [
      "List as an alternative to: Capterra, G2, SimilarWeb",
      "This gives you cross-links from high-DA pages",
      "Add screenshots of your comparison tables",
    ],
    producthunt: [
      "Schedule your launch for Tuesday–Thursday for best traffic",
      "Prepare 3–5 product screenshots in advance",
      "Write a compelling first comment explaining your story",
      "Ask friends/users to upvote on launch day — this is key",
      "Use tagline: 'Compare 100+ AI tools side by side — free'",
    ],
    g2: [
      "Create a free vendor account at sell.g2.com",
      "Category: 'AI Writing Assistant' or 'Business Intelligence'",
      "Ask 5 users to leave reviews — this boosts your profile",
    ],
    capterra: [
      "Category: 'AI Tools' or 'Business Intelligence'",
      "Free listing appears within 5–7 business days",
      "Add screenshots of your comparison tables",
    ],
    hackernews: [
      "Title format: 'Show HN: We Compare AI – side-by-side comparison of 100+ AI tools'",
      "Post between 9am–12pm EST on weekdays for best visibility",
      "Be ready to answer technical questions in comments",
      "Do NOT upvote your own post — HN detects this",
    ],
    reddit: [
      "Title: 'I built a free site to compare 100+ AI tools side by side — pricing, benchmarks, compliance'",
      "Post in: r/artificial, r/ChatGPT, r/MachineLearning, r/SideProject",
      "Add a comment with 3 specific examples of comparisons users can do",
      "Avoid sounding like an ad — be authentic",
    ],
  };

  const list = tips[id] ?? [];
  if (!list.length) return null;

  return (
    <ul className="mt-2 space-y-1.5">
      {list.map((tip, i) => (
        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
          <span className="text-primary mt-0.5 shrink-0">→</span>
          {tip}
        </li>
      ))}
    </ul>
  );
}
