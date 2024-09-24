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
}

const ShimmerItem = () => (
  <div className="flex items-center justify-between py-4 px-4 animate-pulse">
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 bg-gray-300 rounded-full" />
      <div>
        <div className="h-4 w-40 bg-gray-300 rounded" />
        <div className="h-3 w-24 bg-gray-300 rounded mt-2" />
      </div>
    </div>
    <div className="w-8 h-8 bg-gray-300 rounded" />
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
    <Card className="mt-4 border border-slate-200 dark:border-slate-700 rounded-lg">
      <CardContent className="p-0">
        {isLoading ? (
          Array(8)
            .fill(0)
            .map((_, index) => <ShimmerItem key={index} />)
        ) : recentItems && recentItems.length > 0 ? (
          recentItems.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center justify-between py-4 px-4 ${
                index !== recentItems.length - 1
                  ? "border-b border-gray-200 dark:border-slate-700"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    alt={item.user.name}
                    src={item.user.image || undefined}
                  />
                  <AvatarFallback>
                    {item?.user.name && item?.user.name.charAt(0) || "X"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-medium truncate text-ellipsis">
                    {item.title.substring(0, 40)}
                    {item.title.length > 40 ? "..." : ""}
                  </h3>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>
                      {/* @ts-ignore */}
                      {item?.board?.name.substring(0, 10)}
                      {/* @ts-ignore */}
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
                  className="w-8 h-8 p-0 hover:bg-transparent"
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    alert("more");
                  }}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </span>
            </div>
          ))
        ) : (
          <div className="py-4 px-4 text-gray-500 text-center">
            No recent items available.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
