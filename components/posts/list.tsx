"use client";

import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { BoardPostType, PostStatus } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { motion } from "framer-motion";
import Fuse from "fuse.js";

import Spinner from "@/components/common/spinner";

import { PostsCard } from "./card";

interface PostsListProps {
  boardId: string;
  view?: "compact" | "list" | "grid";
  currentUserId: string;
  cols?: number;
  hasAccess: boolean;
  searchKeyword: string;
}

interface Post {
  id: string;
  title: string;
  description: string;
  upvotes: number;
  user: {
    id: string;
    name: string;
  };
  project: {
    slug: string;
  };
  board: {
    slug: string;
  };
  slug: string;
  postType: BoardPostType;
  status: PostStatus | null;
  priority: number | null;
  body: JsonValue;
  userId: string;
  projectId: string;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export function PostsList({
  boardId,
  view = "list",
  currentUserId,
  cols = 2,
  hasAccess,
  searchKeyword,
}: PostsListProps) {
  const [isSearching, setIsSearching] = useState(false);
  const { data, isLoading } = useQuery<{ posts: Post[] }>({
    queryKey: ["posts", boardId],
    queryFn: async () => {
      const response = await fetch(`/api/boards/${boardId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      return response.json();
    },
  });

  const posts = data?.posts || [];
  const [filteredPosts, setFilteredPosts] = useState(posts);
  useEffect(() => {
    if (searchKeyword) {
      setIsSearching(true);
      const fuseOptions = {
        keys: ["title", "description"],
      };

      const fuse = new Fuse(posts, fuseOptions);
      const results = fuse.search(searchKeyword);
      setIsSearching(false);
      setFilteredPosts(results.map((result) => result.item));
    } else {
      setFilteredPosts(posts);
    }
  }, [searchKeyword, data]);
  if (isLoading || isSearching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // Sort posts by createdAt in descending order
  const sortedPosts = [...filteredPosts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <>
      {sortedPosts.length ? (
        <motion.div
          className={` ${
            view === "compact"
              ? "overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800"
              : ""
          } ${
            view === "grid"
              ? `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-4`
              : ""
          } ${view === "list" ? "space-y-2" : ""} `}
        >
          {sortedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={`/${post?.project.slug}/${post.board.slug}/${post.slug}/${post.id}`}
              >
                <PostsCard
                  currentStatus={post.status}
                  currentUserId={currentUserId}
                  hasAccess={hasAccess}
                  layout={view}
                  // @ts-expect-error: will improve ts later
                  post={post}
                  postType={post.postType}
                  // @ts-expect-error: will improve ts later
                  user={post.user!}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="rounded-lg p-8 text-center shadow-sm">
          <p className="text-gray-500">
            No posts yet. Create one to get started!
          </p>
        </div>
      )}
    </>
  );
}
