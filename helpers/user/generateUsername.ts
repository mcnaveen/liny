import { slugify } from "@/helpers/slugify";
import { db } from "@/lib/db";

/**
 * Generates a unique username based on the given email address.
 * @param email - The email address to generate the username from.
 * @returns A unique username.
 */
export const generateUniqueUsername = async (email: string) => {
  // generate base username from email
  const baseUsername = email.split("@")[0];
  let username = slugify(baseUsername);
  let count = 1;

  // Check if the generated username already exists
  while (await db.user.findUnique({ where: { username } })) {
    username = slugify(baseUsername) + count;
    count++;
  }

  return username;
};
