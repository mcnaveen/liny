import { useQuery } from "@tanstack/react-query";

import { Upvote } from "@/types/upvote";

export const useUpvote = (postId: string, userId: string) => {
  return useQuery<Upvote | null, Error>({
    queryKey: ["upvote", postId, userId],
    queryFn: async () => {
      const response = await fetch(`/api/upvote/${postId}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
  });
};
