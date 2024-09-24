"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import PlusIcon from "@/components/icons/plus";

const formSchema = z.object({
  name: z.string().min(1, "Board name is required"),
  description: z.string().min(1, "Board description is required"),
  isPrivate: z.boolean().optional(),
  type: z.enum(["ISSUE", "FEATURE_REQUEST", "CHANGELOG"]),
});

type FormData = z.infer<typeof formSchema>;

export const CreateBoardForm = ({
  open,
  setOpen,
  projectId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  projectId: string;
}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isPrivate: false,
      type: "FEATURE_REQUEST",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          isPrivate: data.isPrivate ?? false,
          type: data.type,
          projectId: projectId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Failed to create board");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Board created successfully");
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      setOpen(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create board",
      );
    },
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    mutation.mutate(data);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <motion.div
        animate={{ opacity: 1, scale: 1 }} // Animate to this state
        exit={{ opacity: 0, scale: 0.9 }} // Exit state
        initial={{ opacity: 0, scale: 0.9 }} // Initial state
        transition={{ duration: 0.3 }} // Animation duration
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Create Board
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Board Name"
                        {...field}
                        autoComplete="off"
                        autoCorrect="off"
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
                    <FormLabel>Board Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Board Description"
                        {...field}
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck="false"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Board Type</FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Board Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FEATURE_REQUEST">
                            Feature Request
                          </SelectItem>
                          <SelectItem disabled value="#">
                            Issue (Coming Soon)
                          </SelectItem>
                          <SelectItem disabled value="#">
                            Changelog (Coming Soon)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <h3 className="mb-4 text-sm font-medium">Board Visibility</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Make Board Private
                        </FormLabel>
                        <FormDescription>
                          Only you and your team members will be able to see
                          this board.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button
                className="my-4 w-full"
                disabled={loading || mutation.status === "pending"}
                type="submit"
              >
                {loading ? "Loading..." : "Create Board"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};

export const CreateBoard = ({ projectId }: { projectId: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon className="mr-2" /> Create Board
      </Button>
      <CreateBoardForm open={open} projectId={projectId} setOpen={setOpen} />
    </>
  );
};
