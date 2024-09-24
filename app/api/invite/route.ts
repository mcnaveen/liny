import { NextRequest, NextResponse } from "next/server";
import { InviteStatus } from "@prisma/client";

import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { email, projectId } = await req.json();

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const invite = await db.invite.create({
    data: {
      email,
      projectId,
      status: InviteStatus.PENDING,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      user: {
        connect: {
          id: user.id,
        },
      },
      project: {
        connect: {
          id: projectId,
        },
      },
    },
  });

  return NextResponse.json({ invite }, { status: 201 });
}
