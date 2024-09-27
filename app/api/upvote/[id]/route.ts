import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { authenticate } from "@/middleware/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const user = await authenticate(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const upvote = await db.upvote.findUnique({
    where: {
      postId_userId: {
        postId: id,
        userId: user.id,
      },
    },
  });

  const upvoteCount = await db.upvote.count({
    where: {
      postId: id,
    },
  });

  return NextResponse.json({
    isUpvoted: upvote ? true : false,
    count: upvoteCount,
  });
}
