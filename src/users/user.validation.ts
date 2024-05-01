import { z, ZodType } from 'zod';

export class UserValidation {
  static readonly CREATE: ZodType = z
    .object({
      username: z.string().min(6),
      password: z.string().min(8),
      confirmPassword: z.string(),
      role: z.enum(['super', 'admin']),
    })
    .refine((value) => {
      return value.password === value.confirmPassword;
    });
}
