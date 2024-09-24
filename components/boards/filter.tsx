"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { useSession } from "next-auth/react";

import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export const BoardFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession(); // Get session data
  const sortValue = searchParams.get("sort") || "";
  const visibilityValue = searchParams.get("visibility") || "";

  const handleFilterChange = (filterType: string, filterValue: string) => {
    const params = new URLSearchParams(searchParams);

    if (filterValue === "none") {
      params.delete(filterType);
    } else if (params.get(filterType) !== filterValue) {
      params.set(filterType, filterValue);
    }
    router.push(`?${params}`);
  };

  const activeFiltersCount =
    (sortValue ? 1 : 0) +
    (visibilityValue && visibilityValue !== "all" ? 1 : 0);

  return (
    <Popover>
      <PopoverTrigger className="relative">
        <Button disabled={!session} size="icon" variant="outline">
          <Filter className="w-4 h-4" />
          {activeFiltersCount > 0 && (
            <div className="absolute top-0 right-0 ml-1 text-xs text-white bg-blue-500 dark:bg-blue-700 rounded-full px-1">
              {activeFiltersCount}
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-4">
          <div>
            <Label>Sort by</Label>
            <Select
              disabled={!session} // Disable select if no session
              value={sortValue}
              onValueChange={(value) => handleFilterChange("sort", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="a-z">A-Z</SelectItem>
                <SelectItem value="z-a">Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Visibility</Label>
            <Select
              disabled={!session} // Disable select if no session
              value={visibilityValue}
              onValueChange={(value) => handleFilterChange("visibility", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
