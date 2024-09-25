import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { getUserProject } from "@/helpers/projects/getUserProject";
import { CreateProject } from "@/components/projects/create";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const project = await getUserProject(session.user.id);

  if (project) {
    redirect(`/${project.slug}`);
  }

  const isSelfHosted = process.env.SELFHOSTED === "true";

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col items-center justify-center space-y-4 py-4 sm:py-6">
      <div className="flex flex-col items-center justify-center space-y-4">
        {isSelfHosted && session.user.isInstanceAdmin ? (
          <>
            <h1 className="text-2xl font-bold">
              Create your first project to get started.
            </h1>
            <CreateProject />
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">You&apos;re signed in</h1>
            <p className="text-center">
              Try visiting the correct project url. If you think this is an
              error, <br />
              please contact the admin.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
