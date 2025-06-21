import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email(),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface InviteParams {
  projectId?: string;
  boardId?: string;
}

export const useInvite = ({ projectId, boardId }: InviteParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InviteFormData) => {
      const response = await fetch("/api/invites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, projectId, boardId }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Failed to send invite");
      }

      return response.json();
    },
    onMutate: async (newInvite) => {
      // Optimistic update logic here
      // You can update the cache with the new invite data
    },
    onSuccess: () => {
      toast.success("Invite sent successfully");
      // Invalidate and refetch relevant queries
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      }
      if (boardId) {
        queryClient.invalidateQueries({ queryKey: ["board", boardId] });
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to send invite"
      );
    },
  });
};
