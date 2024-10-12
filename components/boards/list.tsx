"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Board } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import Fuse from "fuse.js";

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
  const [boards, setBoards] = useState<Board[]>([]);
  const [filteredBoards, setFilteredBoards] = useState<Board[]>([]);
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const sortValue = session ? searchParams.get("sort") || "" : "";
  const visibilityValue = session ? searchParams.get("visibility") || "" : "";
  const searchKeyword = searchParams.get("search-board") || "";

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

  useEffect(() => {
    if (data?.boards) {
      setBoards(data?.boards);
    }
  }, [data?.boards]);

  useEffect(() => {
    let updatedBoards = [...boards];
    if (searchKeyword && updatedBoards.length > 0) {
      const fuseOptions = {
        keys: ["name", "description"],
      };

      const fuse = new Fuse(updatedBoards, fuseOptions);
      const results = fuse.search(searchKeyword);
      updatedBoards = results.map((result) => result.item);
    }
    if (session && updatedBoards.length > 0) {
      // Apply visibility filters
      if (visibilityValue === "private") {
        updatedBoards = updatedBoards.filter((board) => board.isPrivate);
      } else if (visibilityValue === "public") {
        updatedBoards = updatedBoards.filter((board) => !board.isPrivate);
      }

      // Apply sorting
      if (sortValue === "z-a") {
        updatedBoards = _.orderBy(updatedBoards, ["name"], ["desc"]);
      } else if (sortValue === "a-z") {
        updatedBoards = _.orderBy(updatedBoards, ["name"], ["asc"]);
      }
    }
    setFilteredBoards(updatedBoards);
  }, [boards, searchKeyword, visibilityValue, sortValue]);

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
