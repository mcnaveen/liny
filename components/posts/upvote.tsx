"use client";

import { ChevronUp } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useContext, useState } from "react";
import { numify } from "numify";

import { LoginDialogContext } from "@/app/provider";

import { Button } from "../ui/button";
import { LoginDialog } from "../common/login-dialog";

export const UpvoteButton = ({
  isUpvoted,
  postId,
  upvoteCount,
  userId,
}: {
  isUpvoted: boolean;
  postId: string;
  upvoteCount: number;
  userId: string;
}) => {
  const [isActive, setIsActive] = useState(isUpvoted);
  const [count, setCount] = useState(upvoteCount);
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
      setIsActive(!isActive);
      setCount(newData.upvoteCount);
      queryClient.setQueryData(["post", postId], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          upvoteCount: newData.upvoteCount,
          upvotes: isActive
            ? oldData.upvotes.filter((upvote: any) => upvote.userId !== userId)
            : [...(oldData.upvotes || []), { userId, postId }],
        };
      });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success(newData.message);
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
        className={`h-12 w-10 flex-col rounded-xl ${isActive ? "border-blue-200 bg-blue-100" : ""}`}
        size="icon"
        variant={"outline"}
        onClick={
          session.status === "authenticated" ? handleUpvote : handleLoginDialog
        }
      >
        <ChevronUp
          className={isActive ? "font-bold text-blue-500" : ""}
          size={16}
        />
        {count && (
          <span
            className={`text-xs ${isActive ? "font-bold text-blue-500" : ""}`}
          >
            {numify(count)}
          </span>
        )}
      </Button>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </>
  );
};
