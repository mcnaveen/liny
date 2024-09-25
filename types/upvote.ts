export type Upvote = {
  id: string;
  postId: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
