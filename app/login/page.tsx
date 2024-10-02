"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";

import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const session = useSession();
  const router = useRouter();
  const [availableProviders, setAvailableProviders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((res) => res.json())
      .then((providers) => {
        if (Array.isArray(providers)) {
          setAvailableProviders(providers);
        } else {
          setAvailableProviders([]);
        }
      })
      .catch((_error) => {
        setAvailableProviders([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (session.status === "authenticated") {
    router.push("/");

    return null;
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex h-full max-w-7xl flex-col items-center justify-center space-y-4 py-4 sm:py-6">
        <div className="flex animate-pulse flex-col items-center justify-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-gray-300" />
          <div className="h-6 w-16 rounded bg-gray-300" />
          <div className="h-6 w-64 rounded bg-gray-300" />
          <div className="h-6 w-64 rounded bg-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full max-w-7xl flex-col items-center justify-center space-y-4 py-4 sm:py-6">
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
      {availableProviders.includes("github") && (
        <Button
          className="w-64"
          onClick={() => signIn("github", { callbackUrl: "/" })}
        >
          <GithubIcon className="mr-2 h-4 w-4" />
          Login with GitHub
        </Button>
      )}
      {availableProviders.includes("google") && (
        <Button
          className="w-64"
          onClick={() => signIn("google", { callbackUrl: "/" })}
        >
          <GoogleIcon className="mr-2 h-4 w-4" />
          Login with Google
        </Button>
      )}
      {availableProviders.includes("email") && (
        <Button className="w-64" onClick={() => signIn("email")}>
          <Mail className="mr-2 h-4 w-4" />
          Login with Email
        </Button>
      )}
      {availableProviders.length === 0 && (
        <p>No login providers available. Please contact the administrator.</p>
      )}
      <p className="text-sm text-gray-500">Privacy first, open source.</p>
    </div>
  );
}
