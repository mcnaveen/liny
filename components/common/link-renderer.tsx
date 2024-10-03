"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Globe, ExternalLink } from "lucide-react";

const fetchMetaTags = async (href: string) => {
  const response = await fetch(`/api/metatags?url=${href}`);

  return response.json();
};

export const LinkRenderer = ({
  href,
  size = "xs",
  target = "_blank",
  children,
}: {
  href: string;
  size?: "xs" | "sm" | "md" | "lg";
  target?: "_blank" | "_self";
  children?: React.ReactNode;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["metaTags", href],
    queryFn: () => fetchMetaTags(href),
  });

  if (isLoading) {
    return (
      <div className="flex animate-pulse items-center space-x-2">
        <div className="h-4 w-4 rounded-full bg-gray-300" />
        <div className="h-4 w-24 rounded bg-gray-300" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <span className="group flex items-center justify-center">
      <Link
        className="group flex items-center space-x-2 rounded-md bg-card p-1 px-2 shadow-sm hover:text-blue-600"
        href={href}
        target={target}
      >
        {data.favicon ? (
          <Image alt="favicon" height={16} src={data.favicon} width={16} />
        ) : (
          <Globe size={10} />
        )}
        <span className={`line-clamp-1 text-${size}`}>
          {children ? children : data.title.substring(0, 40) + "..."}
        </span>
      </Link>
      <ExternalLink className="invisible ml-0 h-4 w-4 transition-opacity duration-200 group-hover:visible group-hover:ml-2" />
    </span>
  );
};
