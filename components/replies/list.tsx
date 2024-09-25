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
  <div className="flex animate-pulse items-center space-x-4">
    <div className="h-10 w-10 rounded-full bg-gray-200" />
    <div className="flex-1 space-y-4">
      <div className="h-4 w-3/4 rounded bg-gray-200" />
      <div className="h-4 w-5/6 rounded bg-gray-200" />
      <div className="h-4 w-1/2 rounded bg-gray-200" />
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
      <div className="ml-4 mt-2 border-l-2 border-gray-100 pl-4 dark:border-gray-700">
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
