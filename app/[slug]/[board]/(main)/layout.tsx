import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { findBoardBySlug } from "@/helpers/boards/findBoardBySlug";
import { checkUserAccess } from "@/helpers/common/hasAccess";
import { BoardsList } from "@/components/boards/list";
import { formatBoardType } from "@/helpers/common/formatBoardType";
import { Badge } from "@/components/ui/badge";
import { BoardView } from "@/components/boards/view";
import { CreatePost } from "@/components/posts/create";
import { Input } from "@/components/ui/input";

import PrivateBoard from "../../private";

import NotFound from "./not-found";
import { BoardOptions } from "@/components/boards/options";

export default async function BoardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { board: string; slug: string };
}) {
  const board = await findBoardBySlug(params.board);
  const session = await getServerSession(authOptions);

  if (!board) {
    return <NotFound />;
  }

  const hasAccess = await checkUserAccess({
    userId: session?.user?.id,
    projectId: board.projectId,
    boardId: board.id,
  });

  if (board.isPrivate && !hasAccess) {
    return <PrivateBoard type="board" />;
  }

  return (
    <div className="h-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl sm:text-2xl font-bold">{board.name}</h1>
            <Badge variant="outline">
              {formatBoardType(board.boardType as string)}
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Input
              disabled
              className="w-full sm:w-auto"
              placeholder="Search Posts (Coming Soon)"
            />
            <BoardView />
            {session && (
              <CreatePost
                boardId={board.id as string}
                projectId={board.projectId as string}
                text="New Post"
              />
            )}
            <BoardOptions />
          </div>
        </div>
        <p className="text-gray-600">{board.description}</p>
      </div>
      <section className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
        <div className="w-full lg:w-1/3 lg:sticky lg:top-20">
          <div className="flex flex-col space-y-4">
            <BoardsList
              activeBoard={board.id}
              projectId={board.projectId}
              projectSlug={params.slug}
              showAll={false}
              view={"list"}
            />
          </div>
        </div>
        <div className="w-full lg:w-2/3">{children}</div>
      </section>
    </div>
  );
}
