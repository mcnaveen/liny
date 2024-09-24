import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { authenticate } from "@/middleware/auth";
import { generateSlug } from "@/helpers/common/generateSlug";

const createPostSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(["ISSUE", "FEATURE_REQUEST", "CHANGELOG"]),
  boardId: z.string().cuid(),
  projectId: z.string().cuid(),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await authenticate(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.json();

  const validationResult = createPostSchema.safeParse(data);

  if (!validationResult.success) {
    return NextResponse.json(
      { error: validationResult.error },
      { status: 400 },
    );
  }

  const { title, description, type, boardId, projectId } =
    validationResult.data;

  try {
    const create = await db.post.create({
      data: {
        title,
        description: description ?? "",
        postType: type,
        slug: await generateSlug({
          name: title,
          type: "post",
        }),
        boardId,
        projectId,
        userId: user.id,
        status: "PLANNED",
        priority: 0,
      },
    });

    return NextResponse.json({ create }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
