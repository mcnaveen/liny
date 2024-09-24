"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

import { Switch } from "../ui/switch";

const formSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  url: z.string().min(1, "Project url is required"),
  isPrivate: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export const CreateProjectForm = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      url: "",
      isPrivate: false,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Send the entire data object
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || "Failed to create project");
      }

      return response.json();
    },
    onSuccess: (data) => {
      toast.promise(
        new Promise<void>((resolve) => {
          setTimeout(() => {
            router.push(`/${data.slug}`);
            resolve();
          }, 3000);
        }),
        {
          loading: "Creating project...",
          success: "Project created successfully",
          error: "Failed to create project",
        },
      );
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create project",
      );
    },
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    mutation.mutate(data); // Trigger the mutation
    setLoading(false);
  };

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 10 }}
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Project Name"
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
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Project Description"
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
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Project URL"
                        {...field}
                        autoComplete="off"
                        spellCheck="false"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <h3 className="mb-4 text-sm font-medium">Project Visibility</h3>
              <div className="space-y-4 mb-4">
                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Make Project Private
                        </FormLabel>
                        <FormDescription>
                          Only you and your team members will be able to see
                          this project. Also, the project will be hidden from
                          the search engine.
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
                className="my-4 mt-8 w-full"
                disabled={loading || mutation.status === "pending"}
                type="submit"
              >
                {loading ? "Loading..." : "Create Project"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export const CreateProject = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon className="mr-2" /> Create Project
      </Button>
      <CreateProjectForm open={open} setOpen={setOpen} />
    </>
  );
};
