import { z } from "zod";

export const galleryUploadSchema = z.object({
  caption: z.string().min(2, "Add a short caption."),
  memoryDate: z.string().min(1, "Choose the memory date.")
});

export const voiceNoteSchema = z.object({
  title: z.string().min(2, "Give this voice note a title."),
  note: z.string().max(400).optional()
});

export type GalleryUploadValues = z.infer<typeof galleryUploadSchema>;
export type VoiceNoteValues = z.infer<typeof voiceNoteSchema>;

