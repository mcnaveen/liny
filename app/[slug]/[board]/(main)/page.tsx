import { getServerSession } from "next-auth";

import { findBoardBySlug } from "@/helpers/boards/findBoardBySlug";
import { authOptions } from "@/lib/auth";
import { PostsList } from "@/components/posts/list";
import { checkUserAccess } from "@/helpers/common/hasAccess";

import NotFound from "./not-found";

export async function generateMetadata({
  params,
}: {
  params: { board: string; slug: string };
}) {
  const board = await findBoardBySlug(params.board);

  return {
    // @ts-ignore
    title: board?.name + " - " + board?.project?.name,
  };
}

export default async function BoardPage({
  params,
  searchParams,
}: {
  params: { board: string; slug: string };
  searchParams: { view?: string };
}) {
  const board = await findBoardBySlug(params.board);
  const session = await getServerSession(authOptions);
  const view = searchParams.view || "list";

  const hasAccess = await checkUserAccess({
    userId: session?.user.id,
    // @ts-ignore
    projectId: board?.projectId as string,
    // @ts-ignore
    boardId: board?.id,
  });

  if (!board) {
    return <NotFound />;
  }

  return (
    <PostsList
      boardId={board.id}
      cols={2}
      currentUserId={session?.user?.id as string}
      hasAccess={hasAccess}
      view={view as "compact" | "list" | "grid"}
    />
  );
}
