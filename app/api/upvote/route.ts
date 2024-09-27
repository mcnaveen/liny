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

    if (existingUpvote) {
      await db.upvote.delete({
        where: {
          postId_userId: {
            postId: postId,
            userId: user.id,
          },
        },
      });

      const upvoteCount = await db.upvote.count({
        where: {
          postId: postId,
          isActive: true,
        },
      });

      return NextResponse.json({ message: "Upvote removed", upvoteCount });
    } else {
      await db.upvote.create({
        data: {
          postId: postId,
          userId: user.id,
          isActive: true,
        },
      });

      const upvoteCount = await db.upvote.count({
        where: {
          postId: postId,
          isActive: true,
        },
      });

      return NextResponse.json({
        message: "Upvote added",
        upvoteCount,
      });
    }
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
