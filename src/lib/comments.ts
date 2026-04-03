import { prisma } from "@/lib/prisma";

export async function getCommentsByArticle(articleId: string) {
  return prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, name: true, avatar: true } },
    },
  });
}
