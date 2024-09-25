"use client";

import { LayoutGrid, List } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "../ui/button";

export const BoardView = () => {
  const router = useRouter();
  const view = useSearchParams().get("view") || "list";

  const setView = (newView: string) => {
    const params = new URLSearchParams(window.location.search);

    params.set("view", newView);
    router.push(`?${params}`, { scroll: false });
  };

  return (
    <div className="flex h-10 items-center space-x-0.5 rounded-md border p-[2px]">
      <Button
        className={`h-8 w-8 rounded-r-none ${view === "list" ? "bg-card" : "bg-card"}`}
        size="icon"
        variant="ghost"
        onClick={() => setView("list")}
      >
        <List className="h-4 w-4" scale={0.5} />
      </Button>
      <Button
        className={`h-8 w-8 rounded-l-none ${view === "grid" ? "bg-gray-100 dark:bg-gray-900" : "bg-white dark:bg-gray-900"}`}
        size="icon"
        variant="ghost"
        onClick={() => setView("grid")}
      >
        <LayoutGrid className="h-4 w-4" scale={0.5} />
      </Button>
    </div>
  );
};
