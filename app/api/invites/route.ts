import { NextRequest, NextResponse } from "next/server";
import { InviteStatus, InviteType } from "@prisma/client";
import { z } from "zod";

import { db } from "@/lib/db";
import { authenticate } from "@/middleware/auth";
import { checkUserAccess } from "@/helpers/common/hasAccess";

const inviteSchema = z.object({
  email: z.string().email(),
  projectId: z.string().optional(),
  boardId: z.string().optional(),
});

type InviteData = {
  projectId?: string;
  boardId?: string;
  status: InviteStatus;
  expiresAt: Date;
  senderId: string;
  recipientId?: string;
  recipientEmail: string;
  type: InviteType;
};

export async function POST(req: NextRequest) {
  const session = await authenticate(req);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.id;

  try {
    const { email, projectId, boardId } = inviteSchema.parse(await req.json());

    const hasAccess = await checkUserAccess({
      userId: userId,
      projectId: projectId,
      boardId: boardId,
    });

    if (!hasAccess) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user and check recipient existence in a single call
    const [user, checkRecipient] = await Promise.all([
      db.user.findUnique({ where: { id: userId } }),
      db.user.findUnique({ where: { email } }),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if an invite already exists with the same email, projectId, or boardId
    let whereCondition;

    if (boardId) {
      whereCondition = { recipientEmail: email, boardId };
    } else if (projectId) {
      whereCondition = { recipientEmail: email, projectId };
    } else {
      return NextResponse.json(
        { error: "Either projectId or boardId must be provided" },
        { status: 400 }
      );
    }

    const existingInvite = await db.invite.findFirst({
      where: whereCondition,
    });

    if (existingInvite) {
      return NextResponse.json(
        { message: "Invite already exists" },
        { status: 409 }
      );
    }

    const inviteData: InviteData = {
      senderId: userId,
      recipientEmail: email,
      projectId,
      status: InviteStatus.PENDING,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      type: projectId ? InviteType.PROJECT : InviteType.BOARD,
    };

    // If the recipient exists, set their ID in the invite data
    if (checkRecipient) {
      inviteData.recipientId = checkRecipient.id;
    }

    // If boardId is provided, include it in the invite data and fetch the associated projectId
    if (boardId) {
      inviteData.boardId = boardId;
      const board = await db.board.findUnique({
        where: { id: boardId },
        select: { projectId: true },
      });

      if (board) {
        inviteData.projectId = board.projectId;
      }
    }

    // Create the invite in the database
    const createdInvite = await db.invite.create({
      data: inviteData,
    });

    return NextResponse.json({ invite: createdInvite }, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
