export function generateSlug(name: string): string {
  const cleanedName = name.replace(/[^\w\s]/gi, '');
  const slug = cleanedName.trim().replace(/\s+/g, '-').toLowerCase();
  return slug;
}
