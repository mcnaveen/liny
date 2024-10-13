import { NextRequest, NextResponse } from "next/server";
import { InviteStatus } from "@prisma/client";
import { z } from "zod";

import { db } from "@/lib/db";
import { authenticate } from "@/middleware/auth";
import { checkUserAccess } from "@/helpers/common/hasAccess";

const inviteSchema = z.object({
  email: z.string().email(),
  projectId: z.string(),
  boardId: z.string().optional(),
});

type InviteData = {
  projectId?: string;
  status: InviteStatus;
  expiresAt: Date;
  senderId: string;
  recipientId?: string;
  recipientEmail: string;
  boardId?: string;
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
      projectId,
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
    const existingInvite = await db.invite.findFirst({
      where: {
        OR: [
          { recipientEmail: email, projectId },
          { recipientEmail: email, boardId },
          { projectId, boardId },
        ],
      },
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
    };

    // If the recipient exists, set their ID in the invite data
    if (checkRecipient) {
      inviteData.recipientId = checkRecipient.id;
    }

    // If boardId is provided, include it in the invite data
    if (boardId) {
      inviteData.boardId = boardId;
    }

    // Create the invite in the database
    const createdInvite = await db.invite.create({
      data: inviteData,
    });

    return NextResponse.json({ invite: createdInvite }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while processing the request." },
      { status: 500 }
    );
  }
}
