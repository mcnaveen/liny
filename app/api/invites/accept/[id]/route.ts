import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { InviteStatus, ProjectBoardRole, InviteType } from "@prisma/client";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const invite = await db.invite.findUnique({
      where: { id: params.id },
      include: { project: true, board: true },
    });

    if (!invite) {
      return new NextResponse("Invite not found", { status: 404 });
    }

    if (
      invite.recipientId !== session.user.id &&
      invite.recipientEmail !== session.user.email
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (invite.status !== InviteStatus.PENDING) {
      return new NextResponse("Invite is no longer valid", { status: 400 });
    }

    // remove from invite table
    await db.invite.delete({ where: { id: params.id } });

    // Add user to projectUsers and boardUsers based on invite type
    if (invite.type === InviteType.PROJECT && invite.projectId) {
      await db.projectUser.create({
        data: {
          userId: session.user.id,
          projectId: invite.projectId,
          role: ProjectBoardRole.MEMBER,
        },
      });

      // Fetch all boards associated with the project
      const projectBoards = await db.board.findMany({
        where: { projectId: invite.projectId },
      });

      // Add user to all boards of the project
      await Promise.all(
        projectBoards.map((board) =>
          db.boardUser.create({
            data: {
              userId: session.user.id,
              boardId: board.id,
              role: ProjectBoardRole.MEMBER,
            },
          })
        )
      );
    } else if (invite.type === InviteType.BOARD && invite.boardId) {
      await db.boardUser.create({
        data: {
          userId: session.user.id,
          boardId: invite.boardId,
          role: ProjectBoardRole.MEMBER,
        },
      });
    }

    return NextResponse.json({ message: "Invite accepted successfully" });
  } catch (error) {
    console.error("Error accepting invite:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
