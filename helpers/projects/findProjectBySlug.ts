import { db } from "@/lib/db";

export const findProjectBySlug = async (slug: string) => {
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
      },
    });

    if (!project) {
      return null;
    }

    return project;
  } catch (error) {
    return error;
  }
};
