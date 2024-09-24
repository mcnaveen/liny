import { NextRequest, NextResponse } from "next/server";
import { groupBy } from "lodash";

import { db } from "@/lib/db";

interface Reply {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  parentId: string | null;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  children?: Reply[];
}

/**
 * Here in the GET request, id maps to the postId.
 * We are using the postId to get the replies.
 * Because we want get post data as well.
 * As for now, we don't need to query single reply anywhere.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
): Promise<NextResponse> {
  const { id } = params;

  const post = await db.post.findUnique({
    where: { id },
    select: {
      replies: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          body: true,
          createdAt: true,
          updatedAt: true,
          parentId: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  // Group replies by parentId
  const groupedReplies = groupBy(post.replies, "parentId");

  // Create a tree structure
  const replyTree = (groupedReplies["null"] || []) as Reply[];

  replyTree.forEach((reply: Reply) => {
    reply.children = (groupedReplies[reply.id] || []) as Reply[];
  });

  return NextResponse.json({ ...post, replies: replyTree });
}
