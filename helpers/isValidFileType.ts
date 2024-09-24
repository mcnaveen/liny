import {
  allowedImageExtensions,
  allowedVideoExtensions,
} from "@/lib/constants";

/**
 * Checks if the file has a valid file type.
 * @param file - The file to check.
 * @returns A promise that resolves to a boolean indicating whether the file has a valid file type.
 */
export async function isValidFileType(file: File): Promise<boolean> {
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.slice(
    ((fileName.lastIndexOf(".") - 1) >>> 0) + 2,
  );

  const isImage = allowedImageExtensions.includes(`.${fileExtension}`);
  const isVideo = allowedVideoExtensions.includes(`.${fileExtension}`);

  return isImage || isVideo;
}
