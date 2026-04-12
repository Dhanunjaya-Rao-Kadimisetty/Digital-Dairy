import { z } from "zod";

import { diaryMoods } from "@/lib/constants";

export const diaryEntrySchema = z.object({
  title: z.string().min(3, "Title should be at least 3 characters."),
  content: z.string().min(20, "Entry should feel complete enough to revisit."),
  mood: z.enum(diaryMoods),
  visibility: z.enum(["shared", "private"])
});

export const commentSchema = z.object({
  entryId: z.string().uuid(),
  content: z.string().min(2, "Say at least a few words.").max(600)
});

export const reactionSchema = z.object({
  entryId: z.string().uuid(),
  emoji: z.string().min(1).max(4)
});

export type DiaryEntryValues = z.infer<typeof diaryEntrySchema>;
export type CommentValues = z.infer<typeof commentSchema>;
export type ReactionValues = z.infer<typeof reactionSchema>;

