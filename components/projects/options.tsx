"use client";

import { useState } from "react";
import { Check, EllipsisVertical, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import Spinner from "../common/spinner";

const inviteSchema = z.object({
  email: z.string().email(),
});

type InviteFormData = z.infer<typeof inviteSchema>;

const buttonVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const transition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
};

export const ProjectOptions = ({ projectId }: { projectId: string }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteState, setDeleteState] = useState("initial");
  const [showInvite, setShowInvite] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state

  const handleConfirmClick = () => {
    setDeleteState("deleting");
    setTimeout(() => {
      setDeleteState("success");
      setTimeout(() => {
        setDeleteState("initial");
        setShowDeleteConfirm(false);
      }, 2000);
    }, 2000);
  };

  const { register, handleSubmit, reset } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
  });

  const onSubmit = async (data: InviteFormData) => {
    setLoading(true); // Set loading to true on submit
    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, projectId }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        toast.error(errorData.message || "Failed to send invite");

        return;
      }

      toast.success("Invite sent successfully");
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send invite"
      );
    } finally {
      setLoading(false);
      setShowInvite(false);
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="icon" variant="secondary">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="overflow-hidden p-0"
          sideOffset={10}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-2 p-2"
            initial={{ opacity: 0, scale: 0.95 }}
            transition={transition}
          >
            <Button className="w-full" variant="secondary">
              Edit Project
            </Button>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => setShowInvite(true)}
            >
              Invite Team
            </Button>
            <AnimatePresence mode="wait">
              {!showDeleteConfirm ? (
                <motion.div
                  key="delete"
                  animate="animate"
                  exit="exit"
                  initial="initial"
                  transition={transition}
                  variants={buttonVariants}
                >
                  <Button
                    className="w-full"
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                  >
                    Delete Project
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="confirm"
                  animate="animate"
                  className="flex w-full gap-2"
                  exit="exit"
                  initial="initial"
                  transition={transition}
                  variants={buttonVariants}
                >
                  <AnimatePresence mode="wait">
                    {deleteState === "initial" && (
                      <motion.div
                        key="confirmButtons"
                        className="flex w-full gap-2"
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button
                          className="w-full"
                          variant="destructive"
                          onClick={handleConfirmClick}
                        >
                          <Check className="mr-2" /> Confirm
                        </Button>
                        <Button
                          className="w-full"
                          variant="secondary"
                          onClick={() => setShowDeleteConfirm(false)}
                        >
                          <X className="mr-2" /> Cancel
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </PopoverContent>
      </Popover>
      <Dialog open={showInvite} onOpenChange={setShowInvite}>
        <DialogContent>
          <DialogHeader className="text-xl font-bold">Invite Team</DialogHeader>
          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              placeholder="Email"
              type="email"
              {...register("email")}
              className="input"
            />
            <Button className="w-full mt-2" disabled={loading} type="submit">
              {loading ? <Spinner className="animate-spin" /> : "Send Invite"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
