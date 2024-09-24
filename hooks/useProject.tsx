import { useQuery } from "@tanstack/react-query";

import { Project } from "@/types/project";

export const useProject = (projectId: string) => {
  return useQuery<Project | null, Error>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
  });
};
