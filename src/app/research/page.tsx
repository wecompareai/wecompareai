import Link from "next/link";

export default function DynamicResearchPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Dynamic Research</h1>
        </div>
        <p className="text-muted-foreground">
          Hands-on AI evaluation tools — run live prompts, measure performance, find the right AI stack, and explore integrations.
        </p>
      </div>

      {/* Tool cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Card 1 — Compare AI Models Live */}
        <Link
          href="/research/compare"
          className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/10">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              Compare AI Models Live
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">Premium</span>
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Run the same prompt across ChatGPT, Claude, and Gemini simultaneously. See differences in response quality, style, reasoning, and depth — then let each AI critique the others.
            </p>
          </div>

          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["Response quality", "Style & reasoning", "Depth of insight", "Cross-model critique"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:gap-2.5 transition-all">
              Launch tool
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>

        {/* Card 2 — Real-Time Model Benchmarking */}
        <Link
          href="/research/benchmark"
          className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-blue-500/10">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              Real-Time Model Benchmarking
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">Premium</span>
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Analytics-driven performance lab. Measure execution speed, token consumption, cost per run, and output quality — with side-by-side charts for every model.
            </p>
          </div>

          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["Execution speed (ms)", "Cost per run ($)", "Token consumption", "Safety flags", "Performance charts"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2.5 transition-all">
              Launch tool
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
        {/* Card 4 — Prompt Battle */}
        <Link
          href="/research/prompt-battle"
          className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-rose-500/10">
              <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              ⚔️ Side-by-Side Prompt Battle
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">Premium</span>
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Type one prompt and instantly see GPT-4o, Claude 3.7, Gemini, Llama, Mistral, and Grok battle it out side by side. The most satisfying way to pick a model.
            </p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["6 models simultaneously", "Real latency timing", "Copy any response", "Ctrl+Enter to run"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-rose-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 dark:text-rose-400 group-hover:gap-2.5 transition-all">
              Launch battle
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>

        {/* Card 5 — Use-Case Playbooks */}
        <Link
          href="/research/playbooks"
          className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/10">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              📖 Use-Case Playbooks
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Free</span>
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Curated AI stacks for specific jobs — Students, Coders, Marketing Teams, YouTube Creators, and Business Automation. Top tools, real pricing, example workflows.
            </p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["Best AI for Students", "Best AI for Coding", "Best AI for Marketing", "Example workflows included"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 group-hover:gap-2.5 transition-all">
              Browse playbooks
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>

        {/* Card 3 — AI Tool Finder */}
        <Link
          href="/research/finder"
          className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4"
        >
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-violet-500/10">
              <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              AI Tool Finder
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">Premium</span>
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              Answer 6 quick questions about your use case, budget, team, and preferences. Get a personalised AI stack recommendation — the TripAdvisor for AI tools.
            </p>
          </div>

          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["Best model for your needs", "Best platform & workflow tools", "Budget-optimised picks", "Deployment preference match"].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-violet-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 group-hover:gap-2.5 transition-all">
              Launch tool
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>

        {/* Card 6 — ROI Calculator */}
        <Link href="/research/roi-calculator" className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/10">
              <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">💰 AI ROI Calculator <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">Premium</span></h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Find out exactly how much time and money AI can save your team — time saved, cost saved, productivity boost, and payback period.</p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["Time & cost savings", "Productivity boost %", "Payback period", "Shareable results"].map((item) => (
              <li key={item} className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{item}</li>
            ))}
          </ul>
          <div className="pt-2"><span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 group-hover:gap-2.5 transition-all">Calculate ROI <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span></div>
        </Link>

        {/* Card 7 — Workflow Builder */}
        <Link href="/research/workflow-builder" className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-violet-500/10">
              <svg className="w-6 h-6 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">🔧 AI Workflow Builder <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">Premium</span></h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Drag-and-drop AI pipeline builder. Choose models, add tools, connect automations — and export your workflow as JSON.</p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["6 AI models", "5 tool blocks", "5 automation blocks", "Pre-built templates"].map((item) => (
              <li key={item} className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-violet-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{item}</li>
            ))}
          </ul>
          <div className="pt-2"><span className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 group-hover:gap-2.5 transition-all">Open builder <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span></div>
        </Link>

        {/* Card 8 — Cost Per Task */}
        <Link href="/research/cost-per-task" className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-blue-500/10">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">💸 Cost-Per-Task Benchmarks <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Free</span></h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Forget tokens — see what it actually costs to write a blog post, summarise a PDF, debug code, or generate 10 images across every major model.</p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["Writing tasks", "Research & analysis", "Coding tasks", "Image generation"].map((item) => (
              <li key={item} className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{item}</li>
            ))}
          </ul>
          <div className="pt-2"><span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2.5 transition-all">View benchmarks <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span></div>
        </Link>

        {/* Card 9 — Model Tracker */}
        <Link href="/research/model-tracker" className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/10">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">📡 Model Update Tracker <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Free</span></h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">The AI changelog you wish existed. Every model release, price change, deprecation, and API update — tracked in one timeline.</p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["Model releases", "Price changes", "Deprecations", "API updates"].map((item) => (
              <li key={item} className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{item}</li>
            ))}
          </ul>
          <div className="pt-2"><span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 group-hover:gap-2.5 transition-all">View timeline <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span></div>
        </Link>

        {/* Card 10 — Dependency Graph */}
        <Link href="/research/dependency-graph" className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-purple-500/10">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">🕸️ AI Dependency Graph <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Free</span></h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Which apps rely on which models, which companies own which models, and which tools share infrastructure — mapped visually.</p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["By infrastructure (AWS/GCP/Azure)", "By company ownership", "By app dependency", "6 companies, 8 apps mapped"].map((item) => (
              <li key={item} className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-purple-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{item}</li>
            ))}
          </ul>
          <div className="pt-2"><span className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:gap-2.5 transition-all">Explore graph <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span></div>
        </Link>

        {/* Card 11 — Vendor Risk Score */}
        <Link href="/research/vendor-risk" className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-orange-500/10">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">🛡️ AI Vendor Risk Score <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Free</span></h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Score every AI vendor on funding stability, compliance maturity, data retention, and outage history. Know before you commit.</p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["Funding stability", "Compliance maturity", "Data retention risk", "Outage history"].map((item) => (
              <li key={item} className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-orange-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{item}</li>
            ))}
          </ul>
          <div className="pt-2"><span className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 dark:text-orange-400 group-hover:gap-2.5 transition-all">View scores <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span></div>
        </Link>

        {/* Card 12 — Procurement Assistant */}
        <Link href="/research/procurement" className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-sky-500/10">
              <svg className="w-6 h-6 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">📋 AI Procurement Assistant <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">Premium</span></h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">A guided 4-step workflow to shortlist vendors, generate RFPs, compare pricing models, and export compliance checklists.</p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["Vendor shortlisting", "RFP template generator", "Side-by-side comparison", "Compliance checklist export"].map((item) => (
              <li key={item} className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-sky-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{item}</li>
            ))}
          </ul>
          <div className="pt-2"><span className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-600 dark:text-sky-400 group-hover:gap-2.5 transition-all">Start procurement <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span></div>
        </Link>

        {/* Card 13 — Data Governance Simulator */}
        <Link href="/research/data-governance" className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-slate-500/10">
              <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">🔒 Data Governance Simulator <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">Premium</span></h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Toggle on-prem vs cloud, region, PII sensitivity, and compliance requirements — instantly see which AI tools pass or fail your policy.</p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["On-prem vs cloud toggle", "Region (EU/US/APAC)", "HIPAA, GDPR, FedRAMP", "Live compliance verdict"].map((item) => (
              <li key={item} className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{item}</li>
            ))}
          </ul>
          <div className="pt-2"><span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:gap-2.5 transition-all">Open simulator <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span></div>
        </Link>

        {/* Card 14 — Latency Heatmap */}
        <Link href="/research/latency-heatmap" className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/10">
              <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">🌍 Latency Heatmap <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Free</span></h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Median time-to-first-token for 8 frontier models across US East, US West, EU West, and Asia Pacific — color-coded by speed.</p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["8 models compared", "4 global regions", "Color-coded heatmap", "Q1 2026 measurements"].map((item) => (
              <li key={item} className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{item}</li>
            ))}
          </ul>
          <div className="pt-2"><span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 dark:text-amber-400 group-hover:gap-2.5 transition-all">View heatmap <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span></div>
        </Link>

        {/* Card 15 — Reasoning Stress Tests */}
        <Link href="/research/reasoning-tests" className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-rose-500/10">
              <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">🧪 Reasoning Stress Tests <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Free</span></h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Standardised benchmarks for multi-step reasoning, code correctness, long-context retention, and tool-use accuracy across frontier models.</p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["MATH + MMLU-Pro reasoning", "HumanEval code scores", "RULER long-context", "Function-calling accuracy"].map((item) => (
              <li key={item} className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-rose-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{item}</li>
            ))}
          </ul>
          <div className="pt-2"><span className="inline-flex items-center gap-1.5 text-sm font-medium text-rose-600 dark:text-rose-400 group-hover:gap-2.5 transition-all">View benchmarks <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span></div>
        </Link>

        {/* Card 16 — Market Share Dashboard */}
        <Link href="/research/market-share" className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-blue-500/10">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">📊 AI Market Share Dashboard <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Free</span></h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Estimated usage trends across consumer, enterprise, and developer segments based on API adoption, GitHub activity, and search volume.</p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["Consumer market share", "Enterprise API spend", "Developer ecosystem", "Search volume trends"].map((item) => (
              <li key={item} className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-blue-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{item}</li>
            ))}
          </ul>
          <div className="pt-2"><span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2.5 transition-all">View dashboard <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span></div>
        </Link>

        {/* Card 17 — Pricing Index */}
        <Link href="/research/pricing-index" className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-green-500/10">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">💲 AI Pricing Index <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Free</span></h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Current token prices, subscription tiers, and recent cost changes across 11 major models. Updated Q1 2026.</p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["11 models, input & output pricing", "Subscription tier comparison", "Recent price changes", "Cheapest & most expensive flagged"].map((item) => (
              <li key={item} className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-green-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{item}</li>
            ))}
          </ul>
          <div className="pt-2"><span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400 group-hover:gap-2.5 transition-all">View pricing <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span></div>
        </Link>

        {/* Card 18 — AI Stack Builder */}
        <Link href="/research/ai-stack" className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-indigo-500/10">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">🧩 Your AI Stack <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">Premium</span></h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Select your role and budget, answer 5 questions, and get a fully personalized AI tool stack with cost estimates and workflow suggestions.</p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["10 role types", "4 budget tiers", "Compliance-aware", "Cost estimate + workflow tips"].map((item) => (
              <li key={item} className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{item}</li>
            ))}
          </ul>
          <div className="pt-2"><span className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:gap-2.5 transition-all">Build my stack <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span></div>
        </Link>

        {/* Card 19 — Migration Assistant */}
        <Link href="/research/migration" className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4">
          <div className="flex items-start justify-between">
            <div className="p-2.5 rounded-xl bg-teal-500/10">
              <svg className="w-6 h-6 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">🔄 AI Migration Assistant <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">Premium</span></h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Switching models? Compare cost differences, estimate migration effort, find compatible APIs, and get ready-to-use code snippets for Python, JS, and cURL.</p>
          </div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {["15 models supported", "Cost & effort estimate", "API compatibility score", "Python / JS / cURL snippets"].map((item) => (
              <li key={item} className="flex items-center gap-2"><svg className="w-3.5 h-3.5 text-teal-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>{item}</li>
            ))}
          </ul>
          <div className="pt-2"><span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 group-hover:gap-2.5 transition-all">Plan migration <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></span></div>
        </Link>

      </div>
    </div>
  );
}
