import { z, ZodType } from 'zod';

export class GenreValidation {
  static readonly CREATE: ZodType = z.object({
    // slug: z.string(),
    name: z.string(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string(),
    name: z.string(),
  });
}
