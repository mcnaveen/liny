import { slugify } from "@/helpers/slugify";
import { db } from "@/lib/db";

/**
 * Interface for the parameters required to generate a slug.
 */
interface GenerateSlugProps {
  name: string;
  type: "project" | "board" | "post";
}

/**
 * Generates a unique slug for a given name and type.
 * If the generated slug already exists, a random suffix is appended to ensure uniqueness.
 *
 * @param {GenerateSlugProps} params - The parameters for generating the slug.
 * @param {string} params.name - The name to be slugified.
 * @param {"project" | "board" | "post"} params.type - The type of item (project, board, or post).
 * @returns {Promise<string>} - A promise that resolves to the generated slug.
 */
export const generateSlug = async ({
  name,
  type,
}: GenerateSlugProps): Promise<string> => {
  let slug = slugify(name);

  if (type === "post") {
    slug = slug.replace(/[^a-z0-9-]/g, "").slice(0, 30);
  }

  const existingItem = await (type === "project"
    ? db.project.findUnique({ where: { slug } })
    : type === "board"
      ? db.board.findUnique({ where: { slug } })
      : db.post.findUnique({ where: { slug } }));

  return existingItem ? `${slug}-${Date.now()}` : slug;
};
