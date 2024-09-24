import { db } from "@/lib/db";

export async function getUserProject(userId: string) {
  const project = await db.project.findFirst({
    where: {
      userId,
    },
  });

  return project;
}
