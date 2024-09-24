import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { Project } from "@prisma/client";

import { findProjectBySlug } from "@/helpers/projects/findProjectBySlug";
import { BoardsList } from "@/components/boards/list";
import { authOptions } from "@/lib/auth";
import { CreateBoard } from "@/components/boards/create";
import { ProjectOptions } from "@/components/projects/options";
import Spinner from "@/components/common/spinner";
import { checkUserAccess } from "@/helpers/common/hasAccess";
import { BoardView } from "@/components/boards/view";
import { Recent } from "@/components/common/recent";
import { Input } from "@/components/ui/input";
import { Roadmap } from "@/components/common/roadmap";
import { BoardFilter } from "@/components/boards/filter";

import NotFound from "./not-found";
import PrivateBoard from "./private";

// meta data
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const project = (await findProjectBySlug(params.slug)) as Project | null;
  
  return {
    title: project?.name,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = (await findProjectBySlug(params.slug)) as Project | null;
  const session = await getServerSession(authOptions);

  if (!project) {
    return <NotFound />;
  }

  const hasAccess = await checkUserAccess({
    userId: session?.user.id,
    projectId: project?.id,
  });

  if (project.isPrivate && !hasAccess) {
    return <PrivateBoard type="project" />;
  }

  return (
    <div className="h-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      <div>
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          {session && hasAccess && (
            <>
              <Input
                disabled
                className="w-full sm:w-auto"
                placeholder="Search boards... (Coming Soon)"
              />
              <section className="w-full sm:w-auto flex flex-wrap justify-center sm:justify-end gap-2 items-center">
                <Suspense fallback={<Spinner />}>
                  <BoardFilter />
                  <ProjectOptions />
                  {session.user.isInstanceAdmin && (
                    <CreateBoard projectId={project.id} />
                  )}
                </Suspense>
              </section>
            </>
          )}
        </header>
        <main>
          <section className="flex flex-col lg:flex-row lg:space-x-8 justify-around">
            {session && hasAccess && (
              <div className="w-full lg:w-[60%] mb-8 lg:mb-0 lg:sticky lg:top-20">
                <span className="text-md mb-4 block">Recent Activity</span>
                <Recent projectId={project.id} />
              </div>
            )}
            <div className="w-full ">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  <span className="text-md block mb-2 sm:mb-0">Boards</span>
                </div>
                {hasAccess && <BoardView />}
              </div>
              <div className="mt-4">
                <BoardsList
                  projectId={project.id}
                  projectSlug={project.slug}
                  showAll={hasAccess ? true : false}
                  view={hasAccess ? "grid" : "list"}
                />
              </div>
              {!hasAccess && (
                <div className="mt-8">
                  <span className="text-sm mb-4 block">Roadmap</span>
                  <div className="mt-4">
                    <Suspense fallback={<Spinner />}>
                      <Roadmap projectId={project.id} />
                    </Suspense>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
