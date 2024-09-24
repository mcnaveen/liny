import { useQuery } from "@tanstack/react-query";

import { Board } from "@/types/board";
export const useBoard = (slug: string) => {
  return useQuery<Board | null, Error>({
    queryKey: ["boards", slug],
    queryFn: async () => {
      const response = await fetch(`/api/boards/${slug}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
  });
};
