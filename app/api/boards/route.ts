import { NextResponse } from "next/server";
import { z } from "zod";
import { BoardPostType } from "@prisma/client";

import { db } from "@/lib/db";
import { generateSlug } from "@/helpers/common/generateSlug";
import { authenticate } from "@/middleware/auth";
import { checkUserAccess } from "@/helpers/common/hasAccess";

const boardSchema = z.object({
  name: z.string().min(1, "Board name is required"),
  isPrivate: z.boolean().default(false),
  description: z
    .string()
    .min(1, "Description is required")
    .max(100, "Description must be less than 100 characters"),
  type: z.enum(["ISSUE", "FEATURE_REQUEST", "CHANGELOG"]),
  projectId: z.string(),
});

export async function POST(request: Request) {
  const user = await authenticate(request);

  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const parsedData = boardSchema.parse(body);

    const projectId = parsedData.projectId;

    const hasAccess = await checkUserAccess({
      userId: user.id,
      projectId: projectId,
    });

    if (!hasAccess) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const slug = await generateSlug({ name: parsedData.name, type: "board" });

    const newBoard = await db.board.create({
      data: {
        name: parsedData.name,
        isPrivate: parsedData.isPrivate,
        description: parsedData.description,
        boardType: parsedData.type as BoardPostType,
        userId: user.id,
        slug: slug,
        projectId: projectId,
        boardUsers: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
    });

    return NextResponse.json(newBoard, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        { message: "Validation error", errors: fieldErrors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Failed to create board" },
      { status: 500 },
    );
  }
}
