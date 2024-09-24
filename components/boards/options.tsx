"use client";

import { useState } from "react";
import { Check, Cog, EllipsisVertical, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "../ui/button";

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

export const BoardOptions = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteState, setDeleteState] = useState("initial");

  const router = useRouter();
  const currentPath = usePathname();

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

  return (
    <Popover>
      <PopoverTrigger>
        <Button size="icon" variant="secondary">
          <EllipsisVertical className="w-4 h-4" />
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
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => {
              router.push(`${currentPath + "/settings"}`);
            }}
          >
            <Cog className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button className="w-full" variant="secondary">
            Edit Project
          </Button>
          <Button className="w-full" variant="secondary">
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
                className="flex gap-2 w-full"
                exit="exit"
                initial="initial"
                transition={transition}
                variants={buttonVariants}
              >
                <AnimatePresence mode="wait">
                  {deleteState === "initial" && (
                    <motion.div
                      key="confirmButtons"
                      className="flex gap-2 w-full"
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
                  {deleteState === "deleting" && (
                    <motion.div
                      key="deletingButton"
                      animate={{ opacity: 1, width: "100%" }}
                      className="w-full"
                      initial={{ opacity: 0, width: "50%" }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button disabled className="w-full" variant="destructive">
                        Deleting...
                      </Button>
                    </motion.div>
                  )}
                  {deleteState === "success" && (
                    <motion.div
                      key="successButton"
                      animate={{ opacity: 1, width: "100%" }}
                      className="w-full"
                      initial={{ opacity: 0, width: "50%" }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button disabled className="w-full" variant="secondary">
                        <Check className="mr-2" /> Deleted Successfully
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
  );
};
