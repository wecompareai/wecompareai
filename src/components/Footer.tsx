import Link from "next/link";

const FOOTER_LINKS = [
  {
    heading: "Compare",
    links: [
      { label: "All AI Tools", href: "/categories" },
      { label: "VS Comparisons", href: "/vs" },
      { label: "AI Pricing", href: "/pricing" },
      { label: "Best AI Tools", href: "/best" },
      { label: "Alternatives", href: "/alternatives" },
      { label: "Directory", href: "/directory" },
    ],
  },
  {
    heading: "Rankings",
    links: [
      { label: "Overall Rankings", href: "/rankings" },
      { label: "LLM Leaderboard", href: "/research/llm-leaderboard" },
      { label: "Best LLMs", href: "/rankings?category=LLM" },
      { label: "Best Coding Tools", href: "/rankings?category=Coding" },
      { label: "Best Image AI", href: "/rankings?category=Image" },
      { label: "Best Cloud AI", href: "/rankings?category=Cloud" },
    ],
  },
  {
    heading: "Research",
    links: [
      { label: "AI News Digest", href: "/research/ai-news" },
      { label: "Compliance Matrix", href: "/research/compliance" },
      { label: "Integration Graphs", href: "/research/integrations" },
      { label: "Benchmark Data", href: "/research/benchmark" },
      { label: "Market Share", href: "/research/market-share" },
      { label: "Pricing Index", href: "/research/pricing-index" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Methodology", href: "/methodology" },
      { label: "Press & Media Kit", href: "/press" },
      { label: "Newsletter", href: "/newsletter" },
      { label: "Submit a Tool", href: "/submit" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Multi-column links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading}>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">{col.heading}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            © {new Date().getFullYear()}{" "}
            <Link href="/" className="hover:text-foreground transition-colors font-medium">We Compare AI</Link>
            {" "}— The independent AI model &amp; pricing comparison platform.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Use</Link>
            <Link href="/research/compliance" className="hover:text-foreground transition-colors">Compliance</Link>
            <Link href="/glossary" className="hover:text-foreground transition-colors">Glossary</Link>
            <span>Built by Jigar Acharya &amp; Saurabh Gera</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
