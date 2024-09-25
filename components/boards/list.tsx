"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Board } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

import { BoardsCard } from "./card";
import { BoardShimmer } from "./shimmer";

export const BoardsList = ({
  projectId,
  projectSlug,
  view = "list",
  activeBoard,
  showAll = false,
  limit = 4,
}: {
  projectId: string;
  projectSlug: string;
  view?: "list" | "grid";
  activeBoard?: string;
  hasAccess?: boolean;
  showAll?: boolean;
  limit?: number;
}) => {
  const [showAllBoards, setShowAllBoards] = useState(showAll);
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const sortValue = session ? searchParams.get("sort") || "" : "";
  const visibilityValue = session ? searchParams.get("visibility") || "" : "";

  const { data, isLoading } = useQuery<{ boards: Board[] }>({
    queryKey: ["boards"],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch boards");
      }

      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div
        className={` ${
          view === "grid"
            ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2"
            : ""
        } ${view === "list" ? "space-y-2" : ""} `}
      >
        {[...Array(6)].map((_, index) => (
          <BoardShimmer key={index} layout={view} />
        ))}
      </div>
    );
  }

  let filteredBoards = data?.boards || [];

  if (session) {
    // Apply visibility filters
    if (visibilityValue === "private") {
      filteredBoards = filteredBoards.filter((board) => board.isPrivate);
    } else if (visibilityValue === "public") {
      filteredBoards = filteredBoards.filter((board) => !board.isPrivate);
    }

    // Apply sorting
    if (sortValue === "z-a") {
      filteredBoards = _.orderBy(filteredBoards, ["name"], ["desc"]);
    } else if (sortValue === "a-z") {
      filteredBoards = _.orderBy(filteredBoards, ["name"], ["asc"]);
    }
  }

  const displayedBoards = showAllBoards
    ? filteredBoards
    : showAllBoards
      ? filteredBoards
      : filteredBoards.slice(0, limit);

  return (
    <>
      {filteredBoards.length ? (
        <>
          <motion.div
            className={` ${
              view === "grid"
                ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2"
                : ""
            } ${view === "list" ? "space-y-2" : ""} `}
          >
            {displayedBoards.map((board, index) => (
              <motion.div
                key={board.id}
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={`/${projectSlug}/${board.slug}`}>
                  <BoardsCard
                    active={activeBoard === board.id}
                    board={board}
                    layout={view}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
          {filteredBoards.length > 4 && !showAll && (
            <div className="relative mt-8">
              <Separator className="absolute left-0 top-1/2 w-full" />
              <div className="relative flex justify-center">
                <Badge
                  className="cursor-pointer bg-background text-xs"
                  variant="outline"
                  onClick={() => setShowAllBoards(!showAllBoards)}
                >
                  {showAllBoards ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      More
                    </>
                  )}
                </Badge>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg p-8 text-center shadow-sm">
          <p className="text-gray-500">
            No boards yet. Create one to get started!
          </p>
        </div>
      )}
    </>
  );
};
