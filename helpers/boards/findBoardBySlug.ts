import { db } from "@/lib/db";

export const findBoardBySlug = async (slug: string) => {
  try {
    const board = await db.board.findUnique({
      where: {
        slug,
      },
      include: {
        project: true,
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
