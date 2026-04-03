import Link from "next/link";
import { playbooks } from "@/lib/playbooks";

export const metadata = {
  title: "Use-Case Playbooks | AI Compare",
  description:
    "Step-by-step guides for choosing and using the best AI tools for your specific use case — students, coders, marketers, and more.",
};

export default function PlaybooksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Use-Case Playbooks
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Opinionated, step-by-step guides for choosing and using the best AI
          tools for your specific role. Pick a playbook, follow the workflows,
          and get results faster.
        </p>
      </div>

      {/* Playbook cards grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {playbooks.map((playbook) => (
          <Link
            key={playbook.slug}
            href={`/research/playbooks/${playbook.slug}`}
            className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all space-y-4"
          >
            {/* Emoji + arrow */}
            <div className="flex items-start justify-between">
              <span className="text-3xl leading-none" role="img" aria-label={playbook.title}>
                {playbook.emoji}
              </span>
              <svg
                className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>

            {/* Title + tagline */}
            <div>
              <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {playbook.title}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                {playbook.tagline}
              </p>
            </div>

            {/* Bullets */}
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {playbook.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5"
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
                  {bullet}
                </li>
              ))}
            </ul>

            {/* CTA label */}
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:gap-2.5 transition-all">
                Read playbook
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-4">
        <div className="text-2xl">🔍</div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Not sure which playbook fits you?
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Answer 6 quick questions and get a personalised AI stack
            recommendation tailored to your needs and budget.
          </p>
        </div>
        <Link
          href="/research/finder"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
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
    </div>
  );
}
