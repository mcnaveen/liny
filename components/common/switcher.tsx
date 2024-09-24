"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Project } from "@/types/project";
import Spinner from "@/components/common/spinner";
import { CreateProjectForm } from "@/components/projects/create";

export const ProjectSwitcher = () => {
  const [open, setOpen] = React.useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null,
  );
  const router = useRouter();
  const pathname = usePathname();

  const { data: projectsData, isLoading } = useQuery<{ projects: Project[] }>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await fetch("/api/projects");

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      return response.json();
    },
  });

  React.useEffect(() => {
    if (!isLoading && projectsData) {
      const slug = pathname.split("/")[1];
      const project = projectsData.projects.find((p) => p.slug === slug);

      setSelectedProject(project || null);
    }
  }, [pathname, projectsData, isLoading]);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setOpen(false);
    router.push(`/${project.slug}`);
  };

  return (
    <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            aria-expanded={open}
            aria-label="Select a project"
            className="w-[200px] justify-between"
            role="combobox"
            variant="outline"
          >
            {isLoading ? (
              <div className="flex items-center">
                <Spinner className="mr-2" />
                <span>Loading...</span>
              </div>
            ) : selectedProject ? (
              <>
                <Avatar className="mr-2 h-5 w-5">
                  <AvatarImage
                    alt={selectedProject.name}
                    src={`https://avatar.vercel.sh/${selectedProject.slug}.png`}
                  />
                  <AvatarFallback>
                    {selectedProject.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {selectedProject.name}
              </>
            ) : (
              "Select project"
            )}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search project..." />
            <CommandList>
              <CommandEmpty>No project found.</CommandEmpty>
              <CommandGroup heading="Projects">
                {projectsData?.projects.map((project) => (
                  <CommandItem
                    key={project.id}
                    className="text-sm"
                    onSelect={() => handleProjectSelect(project)}
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        alt={project.name}
                        src={`https://avatar.vercel.sh/${project.slug}.png`}
                      />
                      <AvatarFallback>{project.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {project.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedProject?.id === project.id
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewProjectDialog(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create Project
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create project</DialogTitle>
          <DialogDescription>
            Add a new project to manage boards and posts.
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm
          open={showNewProjectDialog}
          setOpen={setShowNewProjectDialog}
        />
      </DialogContent>
    </Dialog>
  );
};
