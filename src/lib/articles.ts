import { prisma } from "@/lib/prisma";

export async function getPublishedArticles(page = 1, pageSize = 12) {
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        published: true,
        createdAt: true,
        updatedAt: true,
        author: { select: { id: true, name: true, avatar: true } },
        _count: { select: { comments: true } },
      },
    }),
    prisma.article.count({ where: { published: true } }),
  ]);
  return { articles, total, totalPages: Math.ceil(total / pageSize) };
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: {
      author: {
        select: { id: true, name: true, avatar: true, bio: true },
      },
      _count: { select: { comments: true } },
    },
  });
}

export async function getArticlesByAuthor(authorId: string) {
  return prisma.article.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { comments: true } },
    },
  });
}

export async function getAllPublishedSlugs() {
  return prisma.article.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });
}

export async function getAllPublishedArticles({ limit = 50 }: { limit?: number } = {}) {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      slug: true,
      title: true,
      excerpt: true,
      coverImage: true,
      createdAt: true,
      updatedAt: true,
      author: { select: { name: true } },
    },
  });
}
