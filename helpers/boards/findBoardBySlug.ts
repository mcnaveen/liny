import { db } from "@/lib/db";

export const findBoardBySlug = async ({
  slug,
  projectSlug,
}: {
  slug: string;
  projectSlug: string;
}) => {
  try {
    const board = await db.board.findUnique({
      where: {
        slug,
        project: {
          slug: projectSlug,
        },
      },
      include: {
        project: true,
        boardUsers: true,
      },
    });

    if (!board) {
      return null;
    }

    return board;
  } catch (error) {
    return error;
  }
};
