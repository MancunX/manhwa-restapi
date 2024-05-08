import { z, ZodType } from 'zod';

export class ComicValidation {
  static readonly CREATE: ZodType = z.object({
    // slug: z.string(),
    name: z.string(),
    // image: z.string().url(),
    synopsis: z.string(),
    author: z.string(),
    artist: z.string(),
    release: z.string(),
    status: z.enum(['ongoing', 'completed']),
    genreId: z.array(z.string()),
    comicTypeId: z.string(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string(),
    name: z.string(),
    synopsis: z.string(),
    author: z.string(),
    artist: z.string(),
    release: z.string(),
    status: z.enum(['ongoing', 'completed']),
    genreId: z.array(z.string()),
    comicTypeId: z.string(),
  });
}
