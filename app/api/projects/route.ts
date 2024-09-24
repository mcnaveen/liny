import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/db";
import { authenticate } from "@/middleware/auth";
import { generateSlug } from "@/helpers/common/generateSlug";

const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

/**
 * Create a new project
 *
 * This function handles the creation of a new project in the database.
 * It authenticates the user making the request and ensures that they
 * have the necessary permissions to create a project. If the user
 * is authenticated, it processes the request data and creates a
 * new project along with an associated ProjectUser entry.
 *
 * @param {NextRequest} request - The incoming request object containing project data.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object
 * containing the created project data or an error message.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const user = await authenticate(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isSelfHosted = process.env.SELFHOSTED === "true";

  if (isSelfHosted) {
    if (!user.isInstanceAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const data = await request.json();

  const parsedData = projectSchema.safeParse(data);

  if (!parsedData.success) {
    return NextResponse.json(
      { error: parsedData.error.errors },
      { status: 400 },
    );
  }

  try {
    const project = await db.project.create({
      data: {
        name: parsedData.data.name,
        description: parsedData.data.description,
        userId: user.id,
        slug: await generateSlug({
          name: parsedData.data.name, // Changed 'text' to 'name'
          type: "project", // Added 'type' property
        }),
        projectUsers: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
    });

    if (project) {
      //create one public and one private board
      await db.board.create({
        data: {
          name: "Sample Public Board",
          description:
            "This is the sample public board. Feel free to delete it.",
          isPrivate: false,
          projectId: project.id,
          userId: user.id,
          slug: await generateSlug({
            name: "Public Board",
            type: "board",
          }),
          boardType: "FEATURE_REQUEST",
        },
      });

      await db.board.create({
        data: {
          name: "Sample Private Board",
          description:
            "This is the sample private board. Feel free to delete it.",
          isPrivate: true,
          projectId: project.id,
          userId: user.id,
          slug: await generateSlug({
            name: "Private Board",
            type: "board",
          }),
          boardType: "FEATURE_REQUEST",
        },
      });
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

/**
 * Get all projects for a user
 *
 * This function retrieves all projects associated with the authenticated user.
 * It authenticates the user making the request and fetches all projects
 * where the user is either an owner or a member, along with the count of boards and topics.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object
 * containing the projects data, board count, topic count, or an error message.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const user = await authenticate(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await db.project.findMany({
      where: {
        projectUsers: {
          some: {
            userId: user.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
        isPrivate: true,
        _count: {
          select: {
            boards: true,
          },
        },
        projectUsers: {
          where: {
            userId: user.id,
          },
          select: {
            role: true,
          },
        },
      },
    });

    const cleanedProjects = projects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      slug: project.slug,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      isPrivate: project.isPrivate,
      boardsCount: project._count.boards,
      isOwner: project.projectUsers[0]?.role === "OWNER",
    }));

    return NextResponse.json({
      projects: cleanedProjects,
      totalBoardsCount: cleanedProjects.reduce(
        (acc, project) => acc + project.boardsCount,
        0,
      ),
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
