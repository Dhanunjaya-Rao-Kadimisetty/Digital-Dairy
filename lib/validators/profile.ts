import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2, "Name should be at least 2 characters."),
  avatarUrl: z.string().url("Avatar URL must be a valid URL.").or(z.literal("")).optional()
});

export type ProfileValues = z.infer<typeof profileSchema>;

