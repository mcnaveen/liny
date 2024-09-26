import { Project } from "@prisma/client";

import { db } from "@/lib/db";

export const findProjectBySlug = async (
  slug: string,
): Promise<Project | null> => {
  try {
    const project = await db.project.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        isPrivate: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });

    return project;
  } catch (error) {
    return null;
  }
};
