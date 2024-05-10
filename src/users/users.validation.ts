import { z, ZodType } from 'zod';

export class UsersValidation {
  static readonly CREATE: ZodType = z
    .object({
      name: z.string(),
      email: z.string().email(),
      username: z.string(),
      password: z.string(),
      confirmPassword: z.string(),
      role: z.enum(['super', 'admin']),
    })
    .refine((value) => {
      return value.password === value.confirmPassword;
    });

  static readonly UPDATE: ZodType = z.object({
    username: z.string(),
    role: z.enum(['super', 'admin']),
  });
}
