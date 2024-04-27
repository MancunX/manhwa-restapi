import { z, ZodType } from 'zod';

export class AuthValidation {
  static readonly SIGNIN: ZodType = z.object({
    username: z.string(),
    password: z.string(),
  });
}
