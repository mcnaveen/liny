import { db } from "@/lib/db";

export async function checkUserAccess({
  userId,
  projectId,
  boardId,
}: {
  userId: string | undefined;
  projectId: string;
  boardId?: string;
}) {
  if (!userId) return false;

  if (boardId) {
    const board = await db.board.findFirst({
      where: {
        id: boardId,
        project: {
          id: projectId,
        },
        OR: [
          {
            project: {
              projectUsers: {
                some: { userId, role: { in: ["OWNER", "ADMIN", "MEMBER"] } },
              },
            },
          },
          {
            boardUsers: {
              some: { userId, role: { in: ["OWNER", "ADMIN", "MEMBER"] } },
            },
          },
        ],
      },
    });

    return !!board;
  } else {
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        projectUsers: {
          some: { userId, role: { in: ["OWNER", "ADMIN", "MEMBER"] } },
        },
      },
    });

    return !!project;
  }
}
