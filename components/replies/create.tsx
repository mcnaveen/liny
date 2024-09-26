"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const replySchema = z.object({
  body: z.string().min(1, { message: "Reply is required" }),
});

type FormData = z.infer<typeof replySchema>;

interface ReplyProps {
  postId?: string;
  parentId?: string;
  boardId?: string;
  projectId?: string;
}

export const Reply = ({ postId, parentId, boardId, projectId }: ReplyProps) => {
  const session = useSession();
  const router = useRouter();
  const currentUrl = window.location.href;

  const queryClient = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      body: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (data.body.trim() === "") {
        throw new Error("Reply content is required");
      }

      const response = await fetch("/api/replies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: data.body,
          postId,
          parentId,
          boardId,
          projectId,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["replies", postId] });
      form.reset();
      toast.success("Reply submitted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    className="w-full focus:!ring-0 focus:!ring-offset-0"
                    placeholder="Write a reply..."
                    disabled={session.status === "unauthenticated"}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {session.status === "authenticated" ? (
            <Button
              className="w-fit"
              disabled={mutation.isPending}
              size="sm"
              type="submit"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Replying...</span>
                </>
              ) : (
                "Reply"
              )}
            </Button>
          ) : (
            <Button
              className="w-fit"
              size="sm"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/login?callbackUrl=${currentUrl}`);
              }}
            >
              Login to Reply
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};
