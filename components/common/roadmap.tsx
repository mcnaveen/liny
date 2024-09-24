import Link from "next/link";

import { db } from "@/lib/db";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { UpvoteButton } from "../posts/upvote";

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

  // Calculate upvote count for each post
  const roadmapWithUpvoteCount = roadmap.map(post => ({
    ...post,
    upvoteCount: post.upvotes.length, // Count the number of upvotes
  }));

  const columns = {
    PLANNED: roadmap.filter((post: any) => post.status === "PLANNED"),
    IN_PROGRESS: roadmap.filter((post: any) => post.status === "IN_PROGRESS"),
    COMPLETED: roadmap.filter((post: any) => post.status === "COMPLETED"),
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {Object.entries(columns).map(([status, posts]) => (
        <div key={status} className="flex-1 p-4 rounded-lg border mb-4 md:mb-0">
          <h3 className="font-semibold mb-4 flex items-center">
            <div
              className={`w-2 h-2 rounded-full inline-block mr-2 ${
                status === "PLANNED"
                  ? "bg-planned"
                  : status === "IN_PROGRESS"
                  ? "bg-progress animate-pulse"
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
                <Card key={post.id} className="p-4 mb-2">
                  <div className="flex items-center">
                    <UpvoteButton
                      isUpvoted={post.isUpvoted}
                      postId={post.id}
                      upvoteCount={post.upvotes.length}
                    />
                    <div className="flex flex-col">
                      <CardTitle className="ml-2 text-sm font-medium font-sans">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="ml-2 text-xs text-muted-foreground uppercase">
                        {post.board.name}
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
