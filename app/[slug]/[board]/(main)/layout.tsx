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
import { BoardOptions } from "@/components/boards/options";

import PrivateBoard from "../../private";

import NotFound from "./not-found";

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
    //@ts-ignore
    projectId: board.projectId,
    //@ts-ignore
    boardId: board.id,
  });

  //@ts-ignore
  if (board.isPrivate && !hasAccess) {
    return <PrivateBoard type="board" />;
  }

  return (
    <div className="mx-auto h-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="mb-8 rounded-lg">
        <div className="mb-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-4">
            {/* @ts-ignore */}
            <h1 className="text-xl font-bold sm:text-2xl">{board.name}</h1>
            <Badge variant="outline">
              {/* @ts-ignore */}
              {formatBoardType(board.boardType as string)}
            </Badge>
          </div>
          <div className="flex flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <Input
              disabled
              className="w-full sm:w-auto"
              placeholder="Search Posts (Coming Soon)"
            />
            <BoardView />
            {session && (
              <CreatePost
                //@ts-ignore
                boardId={board.id as string}
                //@ts-ignore
                projectId={board.projectId as string}
                text="New Post"
              />
            )}
            <BoardOptions />
          </div>
        </div>
        {/* @ts-ignore */}
        <p className="text-gray-600">{board.description}</p>
      </div>
      <section className="flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
        <div className="w-full lg:sticky lg:top-20 lg:w-1/3">
          <div className="flex flex-col space-y-4">
            {/* @ts-ignore */}
            <BoardsList
              //@ts-ignore
              activeBoard={board.id}
              //@ts-ignore
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
