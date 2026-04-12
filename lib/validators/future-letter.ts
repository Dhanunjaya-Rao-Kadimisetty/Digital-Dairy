import { z } from "zod";

export const futureLetterSchema = z.object({
  title: z.string().min(3, "Give this letter a title."),
  content: z.string().min(20, "Letters should have enough heart to return to."),
  unlockDate: z.string().min(1, "Choose when the letter should unlock.")
});

export type FutureLetterValues = z.infer<typeof futureLetterSchema>;

