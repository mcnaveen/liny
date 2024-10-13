"use client";

import React from "react";
import { Board, Invite, Project, User } from "@prisma/client";
import { formatDistance } from "date-fns";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type InviteCardProps = {
  invite: Invite & {
    sender?: User;
    project?: Project;
    board?: Board;
  };
};

export const InviteCard: React.FC<InviteCardProps> = ({ invite }) => {
  const router = useRouter();

  const handleClick = async (action: "accept" | "reject") => {
    try {
      const response = await fetch(`/api/invite/${action}/${invite.id}`, {
        method: "POST",
      });

      if (action === "reject") {
        if (!response.ok) {
          throw new Error("Failed to reject invite");
        }
        toast.success("Invite rejected successfully");

        return;
      }

      if (!response.ok) {
        throw new Error("Failed to accept invite");
      }

      toast.promise(
        (async () => {
          const redirectUrl = invite.board
            ? `/${invite.project?.slug}/${invite.board.slug}`
            : `/${invite.project?.slug}`;

          router.push(redirectUrl);
        })(),
        {
          loading: "Accepting invite...",
          success: "Invite accepted! Redirecting...",
          error: "Failed to accept invite",
        }
      );
    } catch (error) {
      console.error("Error handling invite:", error);
      toast.error(
        action === "reject"
          ? "Failed to reject invite"
          : "Failed to accept invite"
      );
    }
  };

  return (
    <div className="w-full bg-card rounded-lg p-4 transition-shadow duration-200 mt-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={invite?.sender?.image || ""} />
            <AvatarFallback>{invite?.sender?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold flex items-center">
              {invite?.sender?.name
                ? `${invite?.sender?.name} invited you to`
                : "You have been invited to"}
              <span className="font-bold ml-2">
                <Link
                  href={
                    invite.board
                      ? `/${invite.project?.slug}/${invite.board.slug}?ref=invite`
                      : `/${invite.project?.slug}?ref=invite`
                  }
                  target="_blank"
                >
                  {invite?.board?.name || invite?.project?.name}
                </Link>
              </span>
            </h3>
            <div className="items-center inline-flex">
              <span className="flex items-center text-xs text-gray-500">
                Expires{" "}
                <span className="ml-1 font-medium">
                  {formatDistance(new Date(invite.expiresAt), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </span>
              <span className="mx-1 text-gray-400">•</span>
              <span className="flex items-center text-xs text-gray-500">
                Sent{" "}
                <span className="ml-1 font-medium">
                  {formatDistance(new Date(invite.createdAt), new Date(), {
                    addSuffix: true,
                  })}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            className="invite-button mr-2 hover:bg-green-100 hover:text-green-500 hover:border-green-500 hover:animate-pulse"
            size={"icon"}
            variant={"outline"}
            onClick={() => handleClick("accept")}
          >
            <CheckCircle size={16} />
          </Button>
          <Button
            className="invite-button hover:bg-red-100 hover:text-red-500 hover:border-red-500 hover:animate-pulse"
            size={"icon"}
            variant={"outline"}
            onClick={() => handleClick("reject")}
          >
            <XCircle size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};
