import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import path from "path";
import fs from "fs";

export const metadata: Metadata = {
  title: "AI Models by Country",
  description:
    "Explore top AI model providers from countries around the world — USA, China, France, Canada, UK, UAE, and more.",
};

interface Provider {
  name: string;
  model: string;
  description: string;
  features: string[];
}

interface Country {
  country: string;
  flag: string;
  providers: Provider[];
}

function getCountriesData(): Country[] {
  const filePath = path.join(process.cwd(), "data", "countries.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export default async function CountriesPage() {
  const countriesData = getCountriesData();
  const totalProviders = countriesData.reduce((sum, c) => sum + c.providers.length, 0);
  const totalCountries = countriesData.length;
  const session = await auth();
  const canAdd = session?.user?.role === "admin" || session?.user?.role === "contributor";

  return (
    <div className="py-8 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Countries</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              AI Models by Country
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Explore top AI model providers from{" "}
              <span className="text-foreground font-medium">{totalCountries} countries</span>{" "}
              around the world — featuring{" "}
              <span className="text-foreground font-medium">{totalProviders} leading models</span>{" "}
              with descriptions and key capabilities.
            </p>
          </div>
          {canAdd && (
            <Link
              href="/admin/countries/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors font-medium flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Country
            </Link>
          )}
        </div>

        {/* Countries */}
        <div className="space-y-10">
          {countriesData.map((entry) => (
            <section key={entry.country}>
              {/* Country Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl" role="img" aria-label={entry.country}>
                  {entry.flag}
                </span>
                <h2 className="text-2xl font-semibold text-foreground">
                  {entry.country}
                </h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {entry.providers.length} {entry.providers.length === 1 ? "provider" : "providers"}
                </span>
              </div>

              {/* Provider Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {entry.providers.map((provider) => (
                  <div
                    key={provider.name}
                    className="p-5 rounded-xl border border-border bg-background hover:border-primary/40 hover:shadow-md transition-all duration-200"
                  >
                    <div className="mb-3">
                      <p className="text-xs font-medium text-primary uppercase tracking-wide">
                        {provider.name}
                      </p>
                      <h3 className="mt-0.5 text-lg font-bold text-foreground">
                        {provider.model}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {provider.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {provider.features.map((feature) => (
                        <span
                          key={feature}
                          className="inline-block text-xs bg-primary/8 text-primary border border-primary/20 rounded-md px-2 py-0.5"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {entry !== countriesData[countriesData.length - 1] && (
                <hr className="mt-10 border-border" />
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
