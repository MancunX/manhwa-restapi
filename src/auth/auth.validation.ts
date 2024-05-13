import { z, ZodType } from 'zod';

export class AuthValidation {
  static readonly SIGNIN: ZodType = z.object({
    username: z.string(),
    password: z.string(),
  });

  static readonly CHANGEPASSWORD: ZodType = z.object({
    oldPassword: z.string(),
    newPassword: z.string(),
    confirmNewPassword: z.string(),
  });
}
