"use client";

import { ChevronUp } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useContext } from "react";

import { LoginDialogContext } from "@/app/provider";

import { Button } from "../ui/button";
import { LoginDialog } from "../common/login-dialog";

export const UpvoteButton = ({
  isUpvoted,
  postId,
  upvoteCount,
}: {
  isUpvoted: boolean;
  postId: string;
  upvoteCount: number;
}) => {
  const queryClient = useQueryClient();

  const session = useSession();
  const { value: showLoginDialog, setValue: setShowLoginDialog } =
    useContext(LoginDialogContext);

  const upvoteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      if (!response.ok) throw new Error("Failed to upvote");

      return response.json();
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(["post", postId], (oldData: any) => ({
        ...oldData,
        upvoteCount: isUpvoted ? upvoteCount - 1 : upvoteCount + 1,
        upvotes: oldData.upvotes.map((upvote: any) =>
          upvote.userId === newData.upvote.userId ? newData.upvote : upvote,
        ),
      }));
      toast.success(isUpvoted ? "Upvote removed!" : "Upvoted!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    upvoteMutation.mutate();
  };

  const handleLoginDialog = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowLoginDialog(true);
  };

  return (
    <>
      <Button
        className={`rounded-full ${isUpvoted ? "bg-blue-500 text-white" : ""}`}
        size="icon"
        variant="outline"
        onClick={
          session.status === "authenticated" ? handleUpvote : handleLoginDialog
        }
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </>
  );
};
