"use client";

import { formatDistance } from "date-fns";
import { useState } from "react";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

import { Reply } from "./create";

interface Reply {
  id: string;
  body: string;
  createdAt: Date;
  parentId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  children?: Reply[];
}

interface ReplyCardProps {
  boardId: string;
  projectId: string;
  postId: string;
  reply: Reply;
}

export const ReplyCard = ({
  boardId,
  projectId,
  postId,
  reply,
}: ReplyCardProps) => {
  const [showReplyBox, setShowReplyBox] = useState(false);

  const handleReplyClick = () => {
    setShowReplyBox(!showReplyBox);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      handleReplyClick();
    }
  };

  return (
    <div className="space-y-2">
      <div className="group flex items-center space-x-2">
        <Avatar className="h-[34px] w-[34px]">
          <AvatarImage className="h-full w-full" src={reply.user.image!} />
          <AvatarFallback className="h-full w-full">
            {reply.user.name?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {reply.user.name}
            </p>
            <span>•</span>
            <span className="text-xs text-gray-500">
              {formatDistance(reply.createdAt, new Date(), {
                addSuffix: true,
              })}
            </span>
            {reply.parentId ? null : (
              <>
                <span className="hidden group-hover:inline">•</span>
                <span
                  className="hidden cursor-pointer text-xs text-gray-500 group-hover:inline group-hover:transition-all group-hover:duration-300"
                  role="button"
                  tabIndex={0}
                  onClick={handleReplyClick}
                  onKeyDown={handleKeyDown}
                >
                  {showReplyBox ? "Cancel" : "Reply"}
                </span>
              </>
            )}
            <span className="hidden group-hover:inline">•</span>
            <span
              className="hidden cursor-pointer text-xs text-gray-500 group-hover:inline group-hover:transition-all group-hover:duration-300"
              role="button"
              tabIndex={0}
            >
              Edit
            </span>
            <span className="hidden group-hover:inline">•</span>
            <span
              className="hidden cursor-pointer text-xs text-gray-500 hover:text-red-500 group-hover:inline group-hover:transition-all group-hover:duration-300"
              role="button"
              tabIndex={0}
            >
              Delete
            </span>
          </div>
          <p className="text-sm text-gray-500">{reply.body}</p>
        </div>
      </div>
      {showReplyBox && (
        <div className="m-8 ml-14 rounded-xl rounded-tl-none border-l-2 border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
          <Reply
            boardId={boardId}
            parentId={reply.id}
            postId={postId}
            projectId={projectId}
          />
        </div>
      )}
    </div>
  );
};
