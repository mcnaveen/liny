import { db } from "@/lib/db";

export async function checkUserAccess({
  userId,
  projectId,
  boardId,
}: {
  userId: string | undefined;
  projectId?: string;
  boardId?: string;
}) {
  if (!userId) return false;

  if (boardId) {
    const boardUsers = await db.boardUser.findMany({
      where: { userId, boardId, role: { in: ["OWNER", "ADMIN", "MEMBER"] } },
    });

    return boardUsers.length > 0;
  } else if (projectId) {
    const projectUsers = await db.projectUser.findMany({
      where: { userId, projectId, role: { in: ["OWNER", "ADMIN", "MEMBER"] } },
    });

    if (projectUsers.length > 0) return true;

    const boardUsers = await db.boardUser.findMany({
      where: {
        userId,
        role: { in: ["OWNER", "ADMIN", "MEMBER"] },
        board: { projectId },
      },
    });

    return boardUsers.length > 0;
  } else {
    return false;
  }
}
