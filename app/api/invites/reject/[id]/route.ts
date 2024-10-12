import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { InviteStatus } from "@prisma/client";

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

    // Update invite status to REJECTED
    await db.invite.update({
      where: { id: params.id },
      data: { status: InviteStatus.REJECTED },
    });

    return NextResponse.json({ message: "Invite rejected successfully" });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
