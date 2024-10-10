import { Post, Reply, User } from "@prisma/client";
import { BoardPostType } from "@prisma/client";
import { formatDistance } from "date-fns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatPostStatus } from "@/helpers/common/formatPostStatus";
import { Upvote } from "@/types/upvote";

import { UpvoteButton } from "./upvote";
import Options from "./options";

interface PostsCardProps {
  post: Post & {
    user: User & {
      id: string;
      name: string;
      image: string | null;
    };
    upvotes: Upvote[];
    upvoteCount: number;
    replies: Reply[];
  };
  postType: BoardPostType;
  layout: "compact" | "list" | "grid";
  user: User;
  currentUserId: string;
  hasAccess: boolean;
}

export const PostsCard: React.FC<PostsCardProps> = ({
  post,
  layout = "compact",
  currentUserId,
  hasAccess,
}) => {
  const upvoteCount = post?.upvoteCount ? post.upvoteCount : 0;
  const isUpvoted = post?.upvotes.some(
    (upvote) => upvote.userId === currentUserId
  );

  const ListLayout = () => (
    <Card className="data-[hover-state-enabled=true]:hover:drop-shadow-card-hover mb-2 w-full rounded-xl border border-gray-200 bg-white transition-[filter] dark:border-gray-800 dark:bg-black">
      <CardHeader className="flex flex-row items-center gap-3 p-3">
        <div className="flex w-full items-center justify-start gap-4">
          <UpvoteButton
            isUpvoted={isUpvoted}
            postId={post?.id}
            upvoteCount={upvoteCount}
            userId={currentUserId}
          />

          <div className="min-w-0 flex-grow">
            <CardTitle className="flex items-center gap-2 truncate text-base">
              {post.title}
            </CardTitle>
            <div className="mt-1 text-xs text-gray-500 md:flex md:items-center md:gap-1">
              <div className="flex items-center gap-1">
                <span>{post.user.name}</span>
                <span>•</span>
                <span>{upvoteCount} votes</span>
                <span>•</span>
                <span>{post.replies?.length ?? 0} replies</span>
              </div>
              <div className="mt-1 flex items-center gap-1 md:mt-0">
                <span className="md:inline">•</span>
                <span
                  className={`${
                    post.status === "PLANNED"
                      ? "text-yellow-700"
                      : post.status === "IN_PROGRESS"
                        ? "text-blue-700"
                        : post.status === "COMPLETED"
                          ? "text-green-700"
                          : ""
                  } rounded-md p-1`}
                >
                  {formatPostStatus(post.status as string)}
                </span>
                <span>•</span>
                <span>
                  {formatDistance(new Date(post?.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0">
            {hasAccess && (
              <Options
                currentUserId={currentUserId}
                hasAccess={true}
                post={post}
              />
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  const GridLayout = () => (
    <Card className="flex h-full flex-col overflow-hidden rounded-xl">
      <CardHeader className="p-4">
        <div className="flex items-start gap-4">
          <div>
            <span className="text-xs text-gray-500">
              {formatDistance(new Date(post.createdAt), new Date(), {
                addSuffix: true,
              })}
            </span>

            <CardTitle className="flex items-center gap-2 text-lg">
              {post.title}
            </CardTitle>
            <CardDescription className="mt-2">
              {post.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardFooter className="bg-gray-50 p-4 dark:bg-gray-800">
        <div className="flex w-full items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <UpvoteButton
              isUpvoted={isUpvoted}
              postId={post.id}
              upvoteCount={upvoteCount}
              userId={currentUserId}
            />
            <Avatar className="h-6 w-6">
              <AvatarImage
                alt={post?.user?.name ?? "L"}
                src={post?.user?.image!}
              />
              <AvatarFallback>
                {post?.user?.name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
            <span>{post.user.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={`${
                post.status === "PLANNED"
                  ? "bg-yellow-200 text-yellow-700"
                  : post.status === "IN_PROGRESS"
                    ? "bg-blue-200 text-blue-700"
                    : post.status === "COMPLETED"
                      ? "bg-green-200 text-green-700"
                      : ""
              }`}
              variant="secondary"
            >
              {formatPostStatus(post.status as string)}
            </Badge>
            {hasAccess && (
              <Options
                currentUserId={currentUserId}
                hasAccess={true}
                post={post}
              />
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );

  switch (layout) {
    case "list":
      return <ListLayout />;
    case "grid":
      return <GridLayout />;
    default:
      return <ListLayout />;
  }
};
