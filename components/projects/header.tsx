"use client";

import React from "react";

import { Project } from "@/project";

export const ProjectHeader = ({ data }: { data: Project }) => {
  return (
    <>
      <div className="flex items-center gap-2 w-full">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{data.name}</h1>
        </div>
      </div>
    </>
  );
};
