import { z, ZodType } from 'zod';

export class ComicTypeValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string(),
    name: z.string(),
  });
}
