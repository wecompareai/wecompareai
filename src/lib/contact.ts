import { prisma } from "@/lib/prisma";

export async function getActiveRecipients() {
  return prisma.contactRecipient.findMany({
    where: { active: true },
    select: { id: true, name: true, email: true },
  });
}

export async function getAllRecipients() {
  return prisma.contactRecipient.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export async function createSubmission(data: {
  fullName: string;
  email: string;
  mobile?: string;
  description: string;
}) {
  return prisma.contactSubmission.create({ data });
}

export async function getSubmissions(options?: {
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = options?.page || 1;
  const pageSize = options?.pageSize || 20;
  const where = options?.status ? { status: options.status } : {};

  const [submissions, total] = await Promise.all([
    prisma.contactSubmission.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contactSubmission.count({ where }),
  ]);

  return { submissions, total, totalPages: Math.ceil(total / pageSize) };
}
