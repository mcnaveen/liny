import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const posts = await db.post.findMany({
    where: {
      boardId: id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      user: true,
      project: true,
      board: true,
      upvotes: {
        where: {
          isActive: true,
        },
      },
      replies: true,
    },
  });

  const postsWithUpvoteCount = posts.map((post) => ({
    ...post,
    upvoteCount: post.upvotes.length,
  }));

  return NextResponse.json({ posts: postsWithUpvoteCount });
}
