"use client";

import { useQuery } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
import { formatDistance } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "../ui/button";

interface RecentItem {
  id: string;
  title: string;
  status: string;
  number: string;
  createdAt: string;
  user: {
    name: string;
    image: string | null;
  };
  board: {
    name: string;
  };
}

const ShimmerItem = () => (
  <div className="flex animate-pulse items-center justify-between px-4 py-4">
    <div className="flex items-center space-x-2">
      <div className="h-6 w-6 rounded-full bg-gray-300" />
      <div>
        <div className="h-4 w-40 rounded bg-gray-300" />
        <div className="mt-2 h-3 w-24 rounded bg-gray-300" />
      </div>
    </div>
    <div className="h-8 w-8 rounded bg-gray-300" />
  </div>
);

export const Recent = ({ projectId }: { projectId: string }) => {
  const {
    data: recentItems,
    isLoading,
    error,
  } = useQuery<RecentItem[]>({
    queryKey: ["recentItems", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/recent`);

      if (!response.ok) {
        throw new Error("Failed to fetch recent items");
      }

      return response.json();
    },
  });

  if (error) return <div>Error loading recent items</div>;

  return (
    <Card className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700">
      <CardContent className="p-0">
        {isLoading ? (
          Array(8)
            .fill(0)
            .map((_, index) => <ShimmerItem key={index} />)
        ) : recentItems && recentItems.length > 0 ? (
          recentItems.map((item: RecentItem, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between px-4 py-4 ${
                index !== recentItems.length - 1
                  ? "border-b border-gray-200 dark:border-slate-700"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    alt={item.user.name}
                    src={item.user.image || undefined}
                  />
                  <AvatarFallback>
                    {(item?.user.name && item?.user.name.charAt(0)) || "X"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="truncate text-ellipsis text-sm font-medium">
                    {item.title.substring(0, 40)}
                    {item.title.length > 40 ? "..." : ""}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>
                      {item?.board?.name.substring(0, 10)}
                      {item?.board?.name.length > 10 ? "..." : ""}
                    </span>
                    <span>•</span>

                    <span>{item.user.name}</span>
                    <span>•</span>
                    <span>
                      {formatDistance(new Date(item.createdAt), new Date(), {
                        addSuffix: true,
                      })}
                    </span>
                    {item.status === "Error" && (
                      <span className="text-red-400">Error</span>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-gray-400">
                <Button
                  className="h-8 w-8 p-0 hover:bg-transparent"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    alert("more");
                  }}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </span>
            </div>
          ))
        ) : (
          <div className="px-4 py-4 text-center text-gray-500">
            No recent items available.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
