export type Role = "member";
export type Visibility = "shared" | "private";

export type Profile = {
  id: string;
  name: string;
  role: Role;
  avatar_url: string | null;
  last_seen_at: string;
};

export type DiaryEntry = {
  id: string;
  title: string;
  content: string;
  mood: string;
  created_at: string;
  updated_at: string;
  author_id: string;
  visibility: Visibility;
  author?: Profile;
  comments?: CommentItem[];
  reactions?: Reaction[];
};

export type CommentItem = {
  id: string;
  entry_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: Profile;
};

export type Reaction = {
  id: string;
  entry_id: string;
  user_id: string;
  emoji: string;
  user?: Profile;
};

export type GalleryMemory = {
  id: string;
  image_url: string;
  caption: string;
  memory_date: string;
  uploaded_by: string;
  uploader?: Profile;
  signedUrl?: string | null;
};

export type VoiceNote = {
  id: string;
  audio_url: string;
  title: string;
  note: string | null;
  uploaded_by: string;
  created_at: string;
  uploader?: Profile;
  signedUrl?: string | null;
};

export type FutureLetter = {
  id: string;
  title: string;
  content: string;
  unlock_date: string;
  created_by: string;
  author?: Profile;
};

export type DashboardSnapshot = {
  recentEntries: DiaryEntry[];
  totalEntries: number;
  sharedEntries: number;
  memories: number;
  voiceNotes: number;
  futureLetters: number;
};

export type NotificationType = "diary_entry" | "comment" | "reaction" | "memory" | "voice_note" | "future_letter";

export type Notification = {
  id: string;
  user_id: string;
  actor_id: string;
  type: NotificationType;
  entry_id?: string;
  content?: string;
  is_read: boolean;
  created_at: string;
  actor?: Profile;
};
