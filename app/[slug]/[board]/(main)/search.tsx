"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { debounce } from "@/utils/debounce";
const Search = () => {
  const [searchQuery, setSearchQuery] = React.useState<string>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const SearchQueryUpdate = debounce((searchQuery) => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set("search", searchQuery);
    } else {
      params.delete("search");
    }
    router.push(`?${params}`, { scroll: false });
  }, 300);

  // retrieving state from url, could be useful to share the filtered posts
  useEffect(() => {
    setSearchQuery(searchParams.get("search") || "");
  }, []);

  // calling filter upon change in search keyword
  useEffect(() => {
    SearchQueryUpdate(searchQuery);
  }, [searchQuery]);
  return (
    <div>
      <Input
        className="w-full sm:w-auto"
        placeholder="Search Postss"
        onChange={(e) => setSearchQuery(e.target.value as string)}
        value={searchQuery}
      />
    </div>
  );
};

export default Search;
