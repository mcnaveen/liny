"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import PlusIcon from "@/components/icons/plus";

const formSchema = z.object({
  title: z.string().min(1, "Post title is required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export const CreatePostSheet = ({
  boardId,
  open,
  setOpen,
  projectId,
}: {
  boardId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  projectId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId, // Ensure this is included
          title: data.title,
          description: data.description,
          boardId,
          type: "FEATURE_REQUEST",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Failed to create post");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Feature Request Added");
      queryClient.invalidateQueries({ queryKey: ["posts", boardId] });
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create post",
      );
    },
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    mutation.mutate(data);
    setLoading(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="m-4 h-[97%] w-[400px] rounded-lg sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Create Post</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter post title"
                      {...field}
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter post description"
                      {...field}
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full"
              disabled={loading || mutation.status === "pending"}
              type="submit"
            >
              {loading ? "Creating..." : "Add Feature Request"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export const CreatePost = ({
  boardId,
  projectId,
  text,
  icon = false,
}: {
  boardId: string;
  projectId: string;
  text: string;
  icon?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="default" variant="default" onClick={() => setOpen(true)}>
        {icon && <PlusIcon className="mr-2" />} {text || "Create Post"}
      </Button>
      <CreatePostSheet
        boardId={boardId}
        open={open}
        projectId={projectId}
        setOpen={setOpen}
      />
    </>
  );
};
