import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { authenticate } from "@/middleware/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { postId } = await request.json();

  const user = await authenticate(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const existingUpvote = await db.upvote.findUnique({
      where: {
        postId_userId: {
          postId: postId,
          userId: user.id,
        },
      },
    });

    let upvote;

    if (existingUpvote) {
      upvote = await db.upvote.update({
        where: {
          postId_userId: {
            postId: postId,
            userId: user.id,
          },
        },
        data: {
          isActive: !existingUpvote.isActive,
        },
      });
    } else {
      upvote = await db.upvote.create({
        data: {
          postId: postId,
          userId: user.id,
          isActive: true,
        },
      });
    }

    return NextResponse.json({ message: "Upvote toggled", upvote });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
