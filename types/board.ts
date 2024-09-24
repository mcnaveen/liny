import { BoardPostType, Prisma } from "@prisma/client";

export type Board = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  boardType: BoardPostType;
  isPrivate: boolean;
  _count?: {
    posts: number;
  };
};

export type BoardResponse = {
  boards: {
    id: string;
    userId: string;
    boardId: string;
    createdAt: string;
    updatedAt: string;
    board: Board;
  }[];
  postsCount: number;
};

export type BoardWithPosts = Prisma.BoardGetPayload<{
  include: {
    posts: true;
  };
}>;
