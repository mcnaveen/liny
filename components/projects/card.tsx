"use client";

import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/project";

import UsersIcon from "../icons/users";

export const ProjectsCard = ({
  project,
  isOwner,
}: {
  project: Project;
  isOwner: boolean;
}) => {
  return (
    <Card className="data-[hover-state-enabled=true]:hover:drop-shadow-card-hover w-full rounded-xl border border-gray-200 bg-white transition-[filter] dark:border-gray-800 dark:bg-black">
      <CardHeader className="z-10 flex flex-row items-center justify-between">
        <div className="flex-grow">
          <h2 className="text-xl font-bold">{project.name}</h2>
        </div>
      </CardHeader>
      <CardFooter className="z-10 flex flex-row justify-between gap-2">
        <Badge className="h-auto text-xs">
          {project.boardsCount > 0 ? project.boardsCount : 0} Boards
        </Badge>
        {!isOwner && (
          <div className="flex items-center rounded-full p-1">
            <UsersIcon className="h-5 w-5" />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
