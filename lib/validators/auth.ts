import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password should be at least 8 characters.")
});

export const signUpSchema = loginSchema
  .extend({
    name: z.string().min(2, "Please add a display name."),
    confirmPassword: z.string().min(8, "Please confirm your password.")
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

export type LoginValues = z.infer<typeof loginSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
