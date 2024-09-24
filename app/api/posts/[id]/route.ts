import { NextRequest, NextResponse } from "next/server";
import { PostStatus } from "@prisma/client";

import { db } from "@/lib/db";
import { authenticate } from "@/middleware/auth";
import { checkUserAccess } from "@/helpers/common/hasAccess";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const post = await db.post.findUnique({
    where: { id: id as string },
    include: {
      upvotes: true,
      project: {
        select: {
          id: true,
        },
      },
    },
  });

  return NextResponse.json(post);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const user = await authenticate(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await db.post.findUnique({
    where: { id: id as string },
    include: {
      project: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const hasAccess = await checkUserAccess({
    userId: user.id,
    projectId: post.projectId,
  });

  if (!hasAccess) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to delete this post" },
      { status: 403 },
    );
  }

  const deletedPost = await db.post.delete({ where: { id: id as string } });

  return NextResponse.json(deletedPost);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const { title, description, status } = await req.json();

  const user = await authenticate(req);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await db.post.findUnique({
    where: { id: id as string },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const hasAccess = await checkUserAccess({
    userId: user.id,
    projectId: post.projectId,
  });

  if (!hasAccess) {
    return NextResponse.json(
      { error: "Forbidden: You do not have permission to update this post" },
      { status: 403 },
    );
  }

  const updatedPost = await db.post.update({
    where: { id: id as string },
    data: {
      title,
      description,
      status: status as PostStatus,
    },
  });

  return NextResponse.json(updatedPost);
}
