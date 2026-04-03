import { notFound } from "next/navigation";
import Link from "next/link";
import { playbooks, getPlaybook } from "@/lib/playbooks";

export async function generateStaticParams() {
  return playbooks.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const playbook = getPlaybook(slug);
  if (!playbook) return {};
  return {
    title: `${playbook.title} | AI Compare Playbooks`,
    description: playbook.subtitle,
  };
}

const badgeColors: Record<string, string> = {
  Free: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Freemium: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
  Paid: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
};

export default async function PlaybookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const playbook = getPlaybook(slug);

  if (!playbook) notFound();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/research"
          className="hover:text-foreground transition-colors"
        >
          Research
        </Link>
        <span>/</span>
        <Link
          href="/research/playbooks"
          className="hover:text-foreground transition-colors"
        >
          Playbooks
        </Link>
        <span>/</span>
        <span className="text-foreground">{playbook.title}</span>
      </nav>

      {/* Page header */}
      <div className="space-y-3">
        <div className="text-5xl leading-none" role="img" aria-label={playbook.title}>
          {playbook.emoji}
        </div>
        <h1 className="text-3xl font-bold text-foreground">{playbook.title}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
          {playbook.subtitle}
        </p>
      </div>

      {/* ── Top Tools ── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Top Tools</h2>
          <p className="text-sm text-muted-foreground">
            The best AI tools for this use case, ranked by fit.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playbook.tools.map((tool) => (
            <div
              key={tool.name}
              className="rounded-xl border border-border bg-card p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold text-foreground leading-snug">
                  {tool.name}
                </h3>
                <span
                  className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
                    badgeColors[tool.badge] ?? badgeColors.Paid
                  }`}
                >
                  {tool.badge}
                </span>
              </div>
              <p className="text-xs font-mono text-muted-foreground">
                {tool.price}
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                <span className="font-medium text-foreground">Best for: </span>
                {tool.bestFor}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pros & Cons ── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">Pros & Cons</h2>
          <p className="text-sm text-muted-foreground">
            Honest trade-offs for the top tools in this category.
          </p>
        </div>

        <div className="space-y-6">
          {playbook.tools.slice(0, 3).map((tool) => (
            <div
              key={tool.name}
              className="rounded-xl border border-border bg-card p-6 space-y-4"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  {tool.name}
                </h3>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    badgeColors[tool.badge] ?? badgeColors.Paid
                  }`}
                >
                  {tool.badge}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Pros */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Pros
                  </div>
                  <ul className="space-y-2">
                    {tool.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm text-foreground/80">
                        <svg
                          className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons */}
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Cons
                  </div>
                  <ul className="space-y-2">
                    {tool.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm text-foreground/80">
                        <svg
                          className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing Overview ── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            Pricing Overview
          </h2>
          <p className="text-sm text-muted-foreground">
            What you get at each price tier across the top tools.
          </p>
        </div>

        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  Tool
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  Free Tier
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  Paid Tier
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  API Access
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {playbook.tools.map((tool) => (
                <tr
                  key={tool.name}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {tool.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {tool.freeTier}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {tool.paidTier}
                  </td>
                  <td className="px-4 py-3">
                    {tool.apiAccess ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2.5}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        No
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Example Workflows ── */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            Example Workflows
          </h2>
          <p className="text-sm text-muted-foreground">
            Follow these step-by-step workflows to get real results today.
          </p>
        </div>

        <div className="space-y-6">
          {playbook.workflows.map((workflow, wi) => (
            <div
              key={workflow.title}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              {/* Workflow header */}
              <div className="px-6 py-4 border-b border-border bg-primary/5 flex items-center gap-3">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                  {wi + 1}
                </span>
                <h3 className="font-semibold text-foreground">
                  {workflow.title}
                </h3>
              </div>

              {/* Steps */}
              <ol className="divide-y divide-border">
                {workflow.steps.map((step, si) => (
                  <li key={si} className="flex gap-4 px-6 py-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full border border-border text-xs font-semibold text-muted-foreground shrink-0 mt-0.5">
                      {si + 1}
                    </span>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold text-foreground">
            Still not sure which tool is right for you?
          </h3>
          <p className="text-sm text-muted-foreground">
            Answer 6 questions and get a personalised AI stack recommendation
            matched to your exact needs and budget.
          </p>
        </div>
        <Link
          href="/research/finder"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Take the AI Tool Finder quiz
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Back link */}
      <div className="pb-4">
        <Link
          href="/research/playbooks"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to all playbooks
        </Link>
      </div>
    </div>
  );
}
