export type Project = {
  id: string;
  slug: string;
  name: string;
  description: string;
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  boardsCount: number;
  postsCount: number;
  postsLast7Days: {
    createdAt: Date;
    _count: {
      _all: number;
    };
  }[];
  projectUsers: {
    userId: string;
    role: "OWNER" | "MEMBER";
  }[];
};

export type CreateProjectProps = {
  name: string;
  description: string;
  isPublic: boolean;
};
