import { formatDistance } from "date-fns";
import { getServerSession } from "next-auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { findPostById } from "@/helpers/posts/findPostById";
import { UpvoteButton } from "@/components/posts/upvote";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Reply } from "@/components/replies/create";
import { RepliesList } from "@/components/replies/list";
import { LinkRenderer } from "@/components/common/link-renderer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: { post: string; slug: string; board: string };
}) {
  const post = await findPostById(params.post[1]);

  return {
    title:
      post?.title + " - " + post?.board?.name + " - " + post?.project?.name,
  };
}

export default async function PostPage({
  params,
}: {
  params: { post: string; slug: string; board: string };
}) {
  const postId = params.post[1];
  const post = await findPostById(postId);
  const session = await getServerSession(authOptions);

  if (!post) {
    return <div>Post not found</div>;
  }

  const isUpvoted = post?.upvotes.some(
    (upvote) => upvote.user.id === session?.user?.id
  );

  return (
    <>
      <Link href={`/${params.slug}/${params.board}`}>
        <Button className="mb-4 text-sm" size="sm" variant="ghost">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </Link>
      <header className="flex gap-4 rounded-t-lg border-b border-gray-200 bg-gray-100 px-4 py-4 pb-8 dark:border-gray-700 dark:bg-[#0A0A0A] dark:text-gray-200 sm:flex-row sm:items-center sm:px-6">
        <div className="flex-shrink-0">
          <UpvoteButton
            isUpvoted={isUpvoted}
            postId={post.id}
            upvoteCount={post?._count.upvotes}
            userId={session?.user?.id as string}
          />
        </div>
        <div className="flex-grow min-w-0 mt-4 sm:mt-0">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 sm:text-2xl">
            {post.title}
          </h2>
          <p className="mt-1 break-words whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300">
            {post?.description
              ?.split(/(https?:\/\/[^\s]+)/g)
              .map((part, index) =>
                part.match(/https?:\/\/[^\s]+/) ? (
                  <LinkRenderer key={index} href={part}>
                    {part}
                  </LinkRenderer>
                ) : (
                  part
                )
              )}
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300 sm:text-sm">
            {formatDistance(post.createdAt, new Date(), {
              addSuffix: true,
            })}
          </p>
        </div>
      </header>
      <div className="-mt-2">
        <Reply
          boardId={post.boardId as string}
          postId={post.id}
          projectId={post.projectId}
        />
        <div className="mt-4">
          <RepliesList
            boardId={post.boardId}
            postId={post.id}
            projectId={post.projectId}
          />
        </div>
      </div>
    </>
  );
}
