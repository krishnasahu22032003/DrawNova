import z from 'zod';

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(50)
    .transform((v) => v.trim()),
  email: z
    .string()
    .email()
    .min(5)
    .max(50)
    .transform((v) => v.trim().toLowerCase()),
  password: z
    .string()
    .min(8)
    .max(128)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
      'Password must include uppercase, lowercase, number, and special character',
    )
    .transform((v) => v.trim()),
});

