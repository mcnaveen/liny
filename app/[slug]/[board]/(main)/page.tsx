import { getServerSession } from "next-auth";

import { findBoardBySlug } from "@/helpers/boards/findBoardBySlug";
import { authOptions } from "@/lib/auth";
import { PostsList } from "@/components/posts/list";
import { checkUserAccess } from "@/helpers/common/hasAccess";
import { Board } from "@/types/board";
import { Project } from "@/types/project";

import NotFound from "./not-found";

export async function generateMetadata({
  params,
}: {
  params: { board: string; slug: string };
}) {
  const board = (await findBoardBySlug(params.board)) as
    | (Board & { project: Project; projectId: string; id: string })
    | null;

  return {
    title: board?.name + " - " + board?.project?.name,
  };
}

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: { board: string; slug: string };
  searchParams: { view?: string; search: string };
}) {
  const board = (await findBoardBySlug(params.board)) as
    | (Board & { project: Project; projectId: string; id: string })
    | null;
  const session = await getServerSession(authOptions);
  const view = searchParams.view || "list";
  const hasAccess = await checkUserAccess({
    userId: session?.user.id,
    projectId: board?.projectId as string,
    boardId: board?.id,
  });

  if (!board) {
    return <NotFound />;
  }

  return (
    <PostsList
      boardId={board.id}
      searchKeyword={searchParams.search}
      cols={2}
      currentUserId={session?.user?.id as string}
      hasAccess={hasAccess}
      view={view as "compact" | "list" | "grid"}
    />
  );
}
