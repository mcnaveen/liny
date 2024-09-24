"use client";

import { useQuery } from "@tanstack/react-query";

import { ReplyCard } from "./card";

interface Reply {
  id: string;
  body: string;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    username: string | null;
    email: string | null;
    emailVerified: Date | null;
    image: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  children?: Reply[];
  parentId: string;
}

const Shimmer = () => (
  <div className="flex items-center space-x-4 animate-pulse">
    <div className="h-10 w-10 bg-gray-200 rounded-full" />
    <div className="flex-1 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
    </div>
  </div>
);

const ReplyTree = ({
  reply,
  boardId,
  postId,
  projectId,
}: {
  reply: Reply;
  boardId: string;
  postId: string;
  projectId: string;
}) => (
  <div className="mb-4">
    <ReplyCard
      key={reply.id}
      boardId={boardId}
      postId={postId}
      projectId={projectId}
      reply={reply}
    />
    {reply.children && reply.children.length > 0 && (
      <div className="mt-2 ml-4 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
        {reply.children.map((childReply) => (
          <div key={childReply.id} className="mt-2">
            <ReplyCard
              boardId={boardId}
              postId={postId}
              projectId={projectId}
              reply={childReply}
            />
          </div>
        ))}
      </div>
    )}
  </div>
);

export const RepliesList = ({
  postId,
  boardId,
  projectId,
}: {
  postId: string;
  boardId: string;
  projectId: string;
}) => {
  const { data, isLoading, error } = useQuery<{ replies: Reply[] }>({
    queryKey: ["replies", postId],
    queryFn: async () => {
      const response = await fetch(`/api/replies/${postId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch replies");
      }

      return response.json();
    },
  });

  if (isLoading)
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, index) => (
          <Shimmer key={index} />
        ))}
      </div>
    );
  if (error) return <div>Error loading replies</div>;

  return (
    <div>
      {data?.replies?.map((reply) => (
        <ReplyTree
          key={reply.id}
          boardId={boardId}
          postId={postId}
          projectId={projectId}
          reply={reply}
        />
      ))}
    </div>
  );
};
