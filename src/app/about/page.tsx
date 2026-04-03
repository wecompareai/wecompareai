import Link from "next/link";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wecompareai.com";

export const metadata = {
  title: "About Us",
  description:
    "Learn about AI Compare, the team behind the platform, and our mission to simplify AI technology decisions with comprehensive side-by-side comparisons.",
  keywords: [
    "about AI Compare", "AI comparison platform", "AI technology reviews",
    "Jigar Acharya", "Saurabh Gera",
  ],
  openGraph: {
    type: "website" as const,
    url: `${SITE_URL}/about`,
    title: "About Us - AI Compare",
    description:
      "Learn about AI Compare and our mission to simplify AI technology decisions.",
    siteName: "AI Compare",
  },
  twitter: {
    card: "summary" as const,
    title: "About Us - AI Compare",
    description:
      "Learn about AI Compare and our mission to simplify AI technology decisions.",
  },
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            About <span className="text-primary">AI Compare</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Your single destination for comparing all AI technologies.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="pb-16 sm:pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl bg-muted/50 border border-border p-6 sm:p-10">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Our Goal
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              The AI landscape is evolving at an unprecedented pace, with new
              models, platforms, and tools launching every day. Keeping track of
              what each technology offers, how they compare, and which one best
              fits a specific use case can be overwhelming. AI Compare was
              created with a simple yet ambitious goal&mdash;to bring all
              AI-related technologies together in one place, providing clear,
              side-by-side comparisons so that developers, architects, and
              decision-makers can make informed choices quickly and confidently.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Whether you are evaluating large language models, cloud AI
              platforms, or AI-powered coding assistants, AI Compare gives you
              the data you need without the noise. We believe the right
              information, presented the right way, empowers better technology
              decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Contributors */}
      <section className="pb-16 sm:pb-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
            Contributors
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Jigar Acharya */}
            <div className="rounded-xl border border-border p-6 sm:p-8 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">JA</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Jigar Acharya
              </h3>
              <p className="text-sm text-primary font-medium mt-1">
                Solution Architect
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed text-sm">
                Jigar brings over 20 years of experience in IT software design
                and development. His career spans a wide spectrum of
                technologies, from desktop and web applications to mobile, cloud,
                and IoT solutions. This breadth of hands-on experience across
                diverse technology stacks drives the vision behind AI Compare
                &mdash; making it easier for professionals to navigate the
                ever-growing AI ecosystem.
              </p>
            </div>

            {/* Saurabh Gera */}
            <div className="rounded-xl border border-border p-6 sm:p-8 hover:border-primary/50 transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <span className="text-primary font-bold text-xl">SG</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Saurabh Gera
              </h3>
              <p className="text-sm text-primary font-medium mt-1">
                Infrastructure Architect &amp; Director
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed text-sm">
                Saurabh is a seasoned infrastructure architect and
                director-level technology leader with over 15 years of
                experience. His deep expertise in building and managing
                large-scale infrastructure ensures that AI Compare is not only
                informative but also built on a solid, reliable foundation. His
                strategic insight shapes the platform&rsquo;s approach to
                evaluating the operational aspects of AI technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 sm:pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Explore Comparisons
          </Link>
        </div>
      </section>
    </div>
  );
}
