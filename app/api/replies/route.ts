import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { authenticate } from "@/middleware/auth";

// Define the Zod schema for validation
const replySchema = z.object({
  body: z.string().min(1, "Reply content is required"),
  postId: z.string().min(1, "Post ID is required"),
  parentId: z.string().optional(),
  boardId: z.string().optional(),
  projectId: z.string().optional(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await authenticate(request);

  if (user?.id === undefined) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 },
    );
  }

  const data = await request.json();

  const validationResult = replySchema.safeParse(data);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: validationResult.error.errors },
      { status: 400 },
    );
  }

  const { body, postId, parentId, boardId, projectId } = validationResult.data;

  if (body.trim() === "") {
    return NextResponse.json(
      { error: "Reply content is required" },
      { status: 400 },
    );
  }

  if (parentId) {
    const parentReply = await db.reply.findUnique({
      where: { id: parentId },
    });

    if (!parentReply) {
      return NextResponse.json(
        { error: "Parent reply not found" },
        { status: 404 },
      );
    }

    const reply = await db.reply.create({
      data: {
        body,
        postId,
        parentId,
        userId: user.id,
        boardId: boardId,
        projectId: projectId,
      },
      include: {
        upvotes: true,
      },
    });

    return NextResponse.json(reply);
  } else {
    const reply = await db.reply.create({
      data: {
        body,
        postId,
        userId: user.id,
        boardId: boardId,
        projectId: projectId,
      },
    });

    return NextResponse.json(reply);
  }
}
