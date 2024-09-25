export const getMimeType = (ext: string) => {
  const mimes: Record<string, string> = {
    ".aac": "audio/aac",
    ".avi": "video/x-msvideo",
    ".css": "text/css",
    ".csv": "text/csv",
    ".doc": "application/msword",
    ".gif": "image/gif",
    ".htm": "text/html",
    ".html": "text/html",
    ".ico": "image/x-icon",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "application/javascript",
    ".json": "application/json",
    ".mpeg": "video/mpeg",
    ".mov": "video/quicktime",
    ".pdf": "application/pdf",
    ".ppt": "application/vnd.ms-powerpoint",
    ".png": "image/png",
    ".rar": "application/x-rar-compressed",
    ".rtf": "application/rtf",
    ".svg": "image/svg+xml",
    ".tar": "application/x-tar",
    ".tif": "image/tiff",
    ".tiff": "image/tiff",
    ".txt": "text/plain",
    ".wav": "audio/x-wav",
    ".weba": "audio/webm",
    ".webm": "video/webm",
    ".webp": "image/webp",
    ".xhtml": "application/xhtml+xml",
    ".xls": "application/vnd.ms-excel",
    ".xml": "application/xml",
    ".zip": "application/zip",
    ".7z": "application/x-7z-compressed",
  };

  return mimes[ext] || "application/octet-stream";
};