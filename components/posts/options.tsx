"use client";

import { useState } from "react";
import {
  MoreHorizontal,
  Pencil,
  Archive,
  Trash,
  X,
  Check,
  CircleDashed,
  NotebookPen,
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Post } from "@prisma/client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { EditPostForm } from "./edit";

interface OptionsProps {
  currentUserId: string;
  hasAccess: boolean;
  post: Post;
}

export default function Options({
  post,
  currentUserId,
  hasAccess,
}: OptionsProps) {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the post");
      }
    },
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete the post");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update post status");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Post status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["posts", post.boardId] });
      queryClient.invalidateQueries({
        queryKey: ["posts", post.boardId, post.id],
      });
    },
    onError: () => {
      toast.error("Failed to update post status");
    },
  });

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    deleteMutation.mutate();
  };

  const handleStatusUpdate =
    (status: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      updateStatusMutation.mutate(status);
      queryClient.invalidateQueries({ queryKey: ["post", post.id] });
    };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(!open);
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 p-0">
          <div className="flex w-full flex-col">
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                className={`flex w-full items-center justify-start gap-2 px-3 py-2 ${
                  post.status === "PLANNED"
                    ? "bg-yellow-100 text-yellow-700"
                    : ""
                } rounded-none`}
                variant="ghost"
                onClick={handleStatusUpdate("PLANNED")}
              >
                <NotebookPen className="h-4 w-4" />
                <span>Planned</span>
              </Button>
            </motion.div>
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Button
                className={`flex w-full items-center justify-start gap-2 px-3 py-2 ${
                  post.status === "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-700"
                    : ""
                } rounded-none`}
                variant="ghost"
                onClick={handleStatusUpdate("IN_PROGRESS")}
              >
                <CircleDashed className="h-4 w-4" />
                <span>In Progress</span>
              </Button>
            </motion.div>
            <motion.div
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <Button
                className={`flex w-full items-center justify-start gap-2 px-3 py-2 ${
                  post.status === "COMPLETED"
                    ? "bg-green-100 text-green-700"
                    : ""
                } rounded-none`}
                variant="ghost"
                onClick={handleStatusUpdate("COMPLETED")}
              >
                <Check className="h-4 w-4" />
                <span>Completed</span>
              </Button>
            </motion.div>
            <Separator />
            <Button
              className="flex w-full items-center justify-start gap-2 px-3 py-2"
              disabled={!(currentUserId === post.userId || hasAccess)}
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setEditOpen(true);
              }}
            >
              <Pencil className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button
              disabled
              className="flex w-full items-center justify-start gap-2 px-3 py-2"
              variant="ghost"
            >
              <Archive className="h-4 w-4" />
              <span>Archive</span>
            </Button>
            <AnimatePresence>
              {showDeleteConfirm ? (
                <div className="flex w-full text-center">
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                    exit={{ opacity: 0, scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      className="flex w-full items-center gap-2 px-3 py-2 text-red-500"
                      disabled={deleteMutation.isPending}
                      variant="ghost"
                      onClick={handleDelete}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full"
                    exit={{ opacity: 0, scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button
                      className="flex w-full items-center gap-2 px-3 py-2"
                      disabled={deleteMutation.isPending}
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setShowDeleteConfirm(false);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <Button
                  className="flex w-full items-center justify-start gap-2 px-3 py-2 text-red-500"
                  disabled={deleteMutation.isPending}
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setShowDeleteConfirm(true);
                  }}
                >
                  <Trash className="h-4 w-4" />
                  <span>Delete</span>
                </Button>
              )}
            </AnimatePresence>
          </div>
        </PopoverContent>
      </Popover>
      <EditPostForm
        open={editOpen}
        postData={post}
        setOpen={(isOpen) => {
          setEditOpen(isOpen);
          if (!isOpen) {
            setOpen(false);
          }
        }}
      />
    </>
  );
}
