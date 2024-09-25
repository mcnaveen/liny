"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "@prisma/client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(1, "Post title is required"),
  description: z.string().min(1, "Post description is required"),
  content: z.any(),
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]),
});

type FormData = z.infer<typeof formSchema>;

export const EditPostSheet = ({
  postData,
  open,
  setOpen,
  onClose,
}: {
  postData: Post;
  open: boolean;
  setOpen: (open: boolean) => void;
  onClose: (e: React.MouseEvent<Element, MouseEvent>) => void;
}) => {
  const [loading, setLoading] = React.useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      status: "PLANNED",
    },
  });

  React.useEffect(() => {
    if (postData) {
      form.reset({
        title: postData.title,
        description: postData.description,
        content: postData.content,
        status: postData.status,
      });
    }
  }, [postData, form]);

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch(`/api/posts/${postData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Failed to update post");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Post updated successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postData.id] });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to update post",
      );
    },
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    mutation.mutate(data);
    setLoading(false);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose(
            new MouseEvent("click") as unknown as React.MouseEvent<
              Element,
              MouseEvent
            >,
          );
        }
        setOpen(isOpen);
      }}
    >
      <SheetContent
        className="m-4 h-[97%] w-[400px] rounded-lg sm:w-[540px]"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <SheetHeader>
          <SheetTitle>Edit Post</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Post Title"
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
                      placeholder="Post Description"
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PLANNED">Planned</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="my-4 mt-8 w-full"
              disabled={loading || mutation.status === "pending"}
              type="submit"
            >
              {loading ? "Loading..." : "Update Post"}
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export const EditPostForm = ({
  open,
  setOpen,
  postData,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  postData: Post;
}) => {
  const handleClose = (e: React.MouseEvent<Element, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    setOpen(false);
  };

  return (
    <EditPostSheet
      open={open}
      postData={postData}
      setOpen={setOpen}
      onClose={handleClose}
    />
  );
};
