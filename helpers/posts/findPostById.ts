import { db } from "@/lib/db";

export const findPostById = async (id: string) => {
  const post = await db.post.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          upvotes: true,
        },
      },
      upvotes: {
        where: {
          isActive: true,
        },
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      },
      board: {
        select: {
          id: true,
          projectId: true,
          name: true,
          description: true,
          boardType: true,
          slug: true,
        },
      },
      project: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return post;
};
