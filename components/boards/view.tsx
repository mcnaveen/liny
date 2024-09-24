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
    <div className="flex space-x-0.5 h-10 items-center rounded-md border p-[2px]">
      <Button
        className={`rounded-r-none h-8 w-8 ${view === "list" ? "bg-card" : "bg-card"}`}
        size="icon"
        variant="ghost"
        onClick={() => setView("list")}
      >
        <List className="w-4 h-4" scale={0.5} />
      </Button>
      <Button
        className={`rounded-l-none h-8 w-8 ${view === "grid" ? "bg-gray-100 dark:bg-gray-900" : "bg-white dark:bg-gray-900"}`}
        size="icon"
        variant="ghost"
        onClick={() => setView("grid")}
      >
        <LayoutGrid className="w-4 h-4" scale={0.5} />
      </Button>
    </div>
  );
};
