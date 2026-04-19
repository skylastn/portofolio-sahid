import { FormatHelper } from "./format_helper";

export async function uploadFileToPresignedUrl(
  url: string,
  file: File,
): Promise<void> {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type || "application/octet-stream",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error(
      `Upload failed with status ${response.status}${response.statusText ? `: ${response.statusText}` : ""}`,
    );
  }
}

export function buildUploadFileName(file: File): string {
  const baseName = FormatHelper.sanitizeBaseName(file.name || "upload");
  const extension = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf("."))
    : "";
  return `${baseName}${extension}`;
}
