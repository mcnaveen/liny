/**
 * Returns a slugified version of the input text.
 * @param text - The input text to be slugified.
 * @returns The slugified version of the input text.
 */
export const slugify = (text: { toString: () => string }) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word characters
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};
