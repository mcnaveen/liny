import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { InviteStatus, ProjectBoardRole } from "@prisma/client";

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

    // Update invite status
    await db.invite.update({
      where: { id: params.id },
      data: { status: InviteStatus.ACCEPTED },
    });

    // Add user to projectUsers or boardUsers
    if (invite.projectId) {
      await db.projectUser.create({
        data: {
          userId: session.user.id,
          projectId: invite.projectId,
          role: ProjectBoardRole.MEMBER,
        },
      });
    }

    if (invite.boardId) {
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
    console.error(error);

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
