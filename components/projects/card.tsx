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
    <Card className="w-full border-gray-200 bg-white dark:bg-black dark:border-gray-800 border rounded-xl transition-[filter] data-[hover-state-enabled=true]:hover:drop-shadow-card-hover">
      <CardHeader className="flex flex-row items-center z-10 justify-between">
        <div className="flex-grow">
          <h2 className="text-xl font-bold">{project.name}</h2>
        </div>
      </CardHeader>
      <CardFooter className="flex flex-row justify-between gap-2 z-10">
        <Badge className="text-xs h-auto">
          {project.boardsCount > 0 ? project.boardsCount : 0} Boards
        </Badge>
        {!isOwner && (
          <div className="flex items-center rounded-full p-1">
            <UsersIcon className="w-5 h-5" />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
