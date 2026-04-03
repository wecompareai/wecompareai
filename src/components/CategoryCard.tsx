import Link from "next/link";
import { iconMap } from "@/components/IconMap";
import type { Category } from "@/types";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/compare/${category.slug}`}
      className="group block p-6 rounded-xl border border-border bg-background hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
          {iconMap[category.icon] || iconMap.brain}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
