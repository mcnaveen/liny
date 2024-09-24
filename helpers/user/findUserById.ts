import { db } from "@/lib/db";

/**
 * Finds a user by their ID.
 * @param userId - The ID of the user to find.
 * @returns A Promise that resolves to the found user.
 */
export const findUserById = async (userId: string) => {
  const user = await db.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
};
