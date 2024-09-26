import Link from "next/link";

import { db } from "@/lib/db";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

import { UpvoteButton } from "@/components/posts/upvote";

export const Roadmap = async ({ projectId }: { projectId: string }) => {
  const roadmap = await db.post.findMany({
    where: {
      projectId,
      status: {
        in: ["PLANNED", "IN_PROGRESS", "COMPLETED"],
      },
      project: {
        isPrivate: false,
      },
      board: {
        isPrivate: false,
      },
    },
    include: {
      project: {
        select: {
          slug: true,
          isPrivate: true,
        },
      },
      board: {
        select: {
          name: true,
          slug: true,
          isPrivate: true,
        },
      },
      upvotes: {
        select: {
          userId: true,
        },
      },
    },
  });

  const columns = {
    PLANNED: roadmap.filter((post: any) => post.status === "PLANNED"),
    IN_PROGRESS: roadmap.filter((post: any) => post.status === "IN_PROGRESS"),
    COMPLETED: roadmap.filter((post: any) => post.status === "COMPLETED"),
  };

  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row">
      {Object.entries(columns).map(([status, posts]) => (
        <div key={status} className="mb-4 flex-1 rounded-lg border p-4 md:mb-0">
          <h3 className="mb-4 flex items-center font-semibold">
            <div
              className={`mr-2 inline-block h-2 w-2 rounded-full ${
                status === "PLANNED"
                  ? "bg-planned"
                  : status === "IN_PROGRESS"
                    ? "animate-pulse bg-progress"
                    : "bg-completed"
              }`}
            />
            {status.replace("_", " ")}
          </h3>
          <ScrollArea className="h-[550px] w-[350px] rounded-md">
            {posts.reverse().map((post: any) => (
              <Link
                key={post.id}
                href={`/${post.project.slug}/${post.board.slug}/${post.slug}/${post.id}`}
              >
                <Card key={post.id} className="mb-2 p-4">
                  <div className="flex items-center">
                    <UpvoteButton
                      isUpvoted={post.isUpvoted}
                      postId={post.id}
                      upvoteCount={post.upvotes.length}
                    />
                    <div className="flex flex-col">
                      <CardTitle className="ml-2 font-sans text-sm font-medium">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="ml-2 mt-1 text-xs uppercase text-muted-foreground">
                        {post.board.name}{" "}
                        <span className="text-xs text-muted-foreground">•</span>{" "}
                        {post.upvotes.length} votes
                      </CardDescription>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </ScrollArea>
        </div>
      ))}
    </div>
  );
};
