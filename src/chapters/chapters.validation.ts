import { z, ZodType } from 'zod';

export class ChapterValidation {
  static readonly CREATE: ZodType = z.object({
    name: z.string(),
    content: z.string(),
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.string(),
    name: z.string(),
    content: z.string(),
  });
}
