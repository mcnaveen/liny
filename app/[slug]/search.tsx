"use client";
import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { debounce } from "@/utils/debounce";
const Search = ({
  paramName,
  placeHolderValue,
}: {
  paramName: string;
  placeHolderValue: string;
}) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const SearchQueryUpdate = debounce((searchQuery) => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set(paramName, searchQuery);
    } else {
      params.delete(paramName);
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
        placeholder={placeHolderValue}
        onChange={(e) => setSearchQuery(e.target.value as string)}
        value={searchQuery}
      />
    </div>
  );
};

export default Search;
