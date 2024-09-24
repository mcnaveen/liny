"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

import LoginIcon from "../icons/login";

interface SignInButtonProps {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

export const SignInButton: React.FC<SignInButtonProps> = ({
  startContent,
  endContent,
}) => {
  return (
    <Link href="/login">
      <Button aria-label="Signin">
        {startContent && <span className="mr-2">{startContent}</span>}
        <LoginIcon />
        {endContent && <span className="ml-2">{endContent}</span>}
      </Button>
    </Link>
  );
};
