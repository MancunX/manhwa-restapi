export function extractPublicIdFromUrl(
  cloudinaryUrl: string | null,
): string | null {
  if (!cloudinaryUrl) {
    return null;
  }

  const parts = cloudinaryUrl.split('/');
  const filename = parts[parts.length - 1];
  if (!filename) {
    return null;
  }

  const publicId = filename.split('.')[0];
  return publicId;
}
