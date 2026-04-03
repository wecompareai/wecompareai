import { prisma } from "@/lib/prisma";
import type { Category, ComparisonData } from "@/types";

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  icon: true,
} as const;

// ============ Category Queries ============

export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    orderBy: { order: "asc" },
    select: categorySelect,
  });
}

export async function getFeaturedCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    where: { featured: true },
    orderBy: { order: "asc" },
    select: categorySelect,
  });
}

export async function getPaginatedCategories(options: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<{
  categories: Category[];
  total: number;
  totalPages: number;
}> {
  const page = options.page || 1;
  const pageSize = options.pageSize || 24;
  const search = options.search?.trim() || "";

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      orderBy: { order: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: categorySelect,
    }),
    prisma.category.count({ where }),
  ]);

  return {
    categories,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

// ============ Comparison Queries ============

export async function getComparisonData(
  slug: string
): Promise<ComparisonData | null> {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { comparison: true },
  });

  if (!category?.comparison) return null;

  const { columns, groups } = JSON.parse(category.comparison.data);

  return {
    id: category.slug,
    title: category.comparison.title,
    description: category.comparison.description,
    lastUpdated: category.comparison.lastUpdated.toISOString().split("T")[0],
    columns,
    groups,
  };
}

export async function getAllComparisonSlugs(): Promise<string[]> {
  const categories = await prisma.category.findMany({
    where: { comparison: { isNot: null } },
    select: { slug: true },
  });
  return categories.map((c) => c.slug);
}

export async function getFeaturedComparisonSlugs(): Promise<string[]> {
  const categories = await prisma.category.findMany({
    where: {
      featured: true,
      comparison: { isNot: null },
    },
    select: { slug: true },
  });
  return categories.map((c) => c.slug);
}

export async function saveComparisonData(
  slug: string,
  data: ComparisonData
): Promise<void> {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { comparison: true },
  });

  if (!category) throw new Error(`Category not found: ${slug}`);

  const dataPayload = JSON.stringify({
    columns: data.columns,
    groups: data.groups,
  });

  if (category.comparison) {
    await prisma.comparison.update({
      where: { id: category.comparison.id },
      data: {
        title: data.title,
        description: data.description,
        data: dataPayload,
        lastUpdated: new Date(data.lastUpdated),
      },
    });
  } else {
    await prisma.comparison.create({
      data: {
        categoryId: category.id,
        title: data.title,
        description: data.description,
        data: dataPayload,
        lastUpdated: new Date(data.lastUpdated),
      },
    });
  }
}
