"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { GithubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export default function LoginPage() {
  const session = useSession();
  const router = useRouter();

  if (session.status === "authenticated") {
    router.push("/");
  }

  return (
    <div className="h-full py-4 sm:py-6 max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        <Image
          alt="Liny Logo"
          className="rounded-full"
          height={60}
          src="./liny-logo.svg"
          width={60}
        />
        <h1 className="text-2xl font-bold">Welcome to Liny!</h1>
      </div>
      <Button
        className="w-64"
        onClick={() => {
          signIn("github");
        }}
      >
        <GithubIcon className="w-4 h-4 mr-2" />
        Login with GitHub
      </Button>
      <Button
        className="w-64"
        onClick={() => {
          signIn("email");
        }}
      >
        <Mail className="w-4 h-4 mr-2" />
        Login with Email
      </Button>
      <p className="text-sm text-gray-500">Privacy first, open source.</p>
    </div>
  );
}
