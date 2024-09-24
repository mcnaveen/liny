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
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (data?.projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LifebuoyIcon className="w-20 h-20 text-gray-700 mb-4" />
        <h2 className="text-xl font-bold">No Projects Available</h2>
        <p className="text-gray-500">
          It seems there are no projects available.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:px-0 px-4">
      {data?.projects.map((project) => (
        <Link key={project.id} className="w-full" href={`/${project.slug}`}>
          {/* TODO: handle isOwner based on the db data */}
          <ProjectsCard isOwner={true} project={project} />
        </Link>
      ))}
    </div>
  );
};
