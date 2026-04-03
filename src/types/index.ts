export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface Column {
  id: string;
  name: string;
  provider: string;
  logo: string;
  url: string;
}

export interface Row {
  feature: string;
  tooltip?: string;
  values: Record<string, string | boolean | number>;
}

export interface Group {
  name: string;
  rows: Row[];
}

export interface ComparisonData {
  id: string;
  title: string;
  description: string;
  lastUpdated: string;
  columns: Column[];
  groups: Group[];
}

// ============ Domain Types ============

export interface DomainSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  subdomainCount: number;
}

export interface SubdomainSummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  comparisonCount: number;
}

export interface DomainComparisonSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  lastUpdated: string;
}
