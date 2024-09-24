"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProjectSwitcher } from "@/components/common/switcher";
import { ThemeSwitch } from "@/components/common/theme";
import { SignOutButton } from "@/components/common/signout-button";
import { SignInButton } from "@/components/common/signin-button";

export const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 bg-white dark:bg-[#0A0A0A] z-10 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <Link className="flex-shrink-0" href="/">
                <Image
                  alt="Liny Logo"
                  className="rounded-full w-8 h-8"
                  height={32}
                  src={`${process.env.NEXT_PUBLIC_APP_URL}/liny-logo.svg`}
                  width={32}
                />
              </Link>
              {session?.user.isInstanceAdmin && <ProjectSwitcher />}
            </div>
            <div className="hidden sm:block ml-10">
              {/* Add your navigation items here if needed */}
            </div>
          </div>
          <div className="flex items-center">
            <div className="ml-4 flex items-center">
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="border-2 border-gradient-to-r from-[#FF1CF7] to-[#b249f8]">
                      <AvatarImage src={session?.user.image!} />
                      <AvatarFallback>
                        {session?.user.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="flex w-full flex-col space-y-px rounded-md bg-white dark:bg-black p-3 sm:w-56"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>
                      <ThemeSwitch showText />
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <SignOutButton />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-4">
                  {!session && <ThemeSwitch />}
                  <SignInButton startContent={<span>Login</span>} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
