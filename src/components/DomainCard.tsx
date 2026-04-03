import Link from "next/link";
import { iconMap } from "@/components/IconMap";
import type { DomainSummary } from "@/types";

export default function DomainCard({ domain }: { domain: DomainSummary }) {
  return (
    <Link
      href={`/domains/${domain.slug}`}
      className="group block p-6 rounded-xl border border-border bg-background hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          {iconMap[domain.icon] || iconMap.brain}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {domain.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {domain.description}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {domain.subdomainCount} {domain.subdomainCount === 1 ? "area" : "areas"}
          </p>
        </div>
      </div>
    </Link>
  );
}
