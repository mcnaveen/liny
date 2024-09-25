"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import Spinner from "@/components/common/spinner";
import { Project } from "@/types/project";

import LifebuoyIcon from "../icons/lifebuoy";

import { ProjectsCard } from "./card";

export const ProjectsList = () => {
  const { data, isLoading } = useQuery<{ projects: Project[] }>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (data?.projects.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <LifebuoyIcon className="mb-4 h-20 w-20 text-gray-700" />
        <h2 className="text-xl font-bold">No Projects Available</h2>
        <p className="text-gray-500">
          It seems there are no projects available.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-4 px-4 sm:px-0 md:grid-cols-2 lg:grid-cols-3">
      {data?.projects.map((project) => (
        <Link key={project.id} className="w-full" href={`/${project.slug}`}>
          {/* TODO: handle isOwner based on the db data */}
          <ProjectsCard isOwner={true} project={project} />
        </Link>
      ))}
    </div>
  );
};
