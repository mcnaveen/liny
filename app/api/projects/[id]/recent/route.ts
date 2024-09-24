import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const projectId = params.id;

  if (!projectId) {
    return NextResponse.json(
      { error: "Project ID is required" },
      { status: 400 }
    );
  }

  try {
    const recentItems = await db.post.findMany({
      where: {
        projectId: projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        board: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    });

    const formattedRecentItems = recentItems.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedRecentItems);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
