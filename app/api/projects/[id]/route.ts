import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import { checkUserAccess } from "@/helpers/common/hasAccess";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const session = await getServerSession(authOptions);

  const hasAccess = await checkUserAccess({
    userId: session?.user.id,
    projectId: id,
  });

  const boards = await db.board.findMany({
    where: {
      projectId: id,
      OR: [
        {
          isPrivate: false,
        },
        {
          isPrivate: true,
          AND: [
            {
              OR: [
                {
                  project: {
                    projectUsers: {
                      some: {
                        userId: session?.user.id,
                        role: {
                          in: ["OWNER", "ADMIN", "MEMBER"],
                        },
                      },
                    },
                  },
                },
                {
                  boardUsers: {
                    some: {
                      userId: session?.user.id,
                      role: {
                        in: ["OWNER", "ADMIN", "MEMBER"],
                      },
                    },
                  },
                },
              ],
            },
            { isPrivate: hasAccess },
          ],
        },
      ],
    },
    include: {
      project: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  return NextResponse.json({ boards });
}
