"use client";

import { signOut } from "next-auth/react";
import clsx from "clsx";

import LogoutIcon from "../icons/logout";

export interface SignOutButtonProps {
  className?: string;
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({ className }) => {
  return (
    <button
      aria-label="Sign out"
      className={clsx(
        "cursor-pointer flex items-center gap-2 w-full",
        className,
      )}
      onClick={() => signOut()}
    >
      <LogoutIcon className="h-6 w-6" />
      Logout
    </button>
  );
};
