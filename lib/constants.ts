import {
  BookHeart,
  GalleryVertical,
  Headphones,
  Home,
  LockKeyhole,
  UserRound
} from "lucide-react";

export const diaryMoods = [
  "Hopeful",
  "Tender",
  "Grateful",
  "Nostalgic",
  "Heavy",
  "Joyful",
  "Quiet",
  "Restless"
] as const;

export const reactionOptions = ["❤️", "🥹", "🌙", "🫶", "✨", "😭"] as const;

export const visibilityOptions = [
  { label: "Shared with both of you", value: "shared" },
  { label: "Only visible to you", value: "private" }
] as const;

export const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/diary", label: "Diary", icon: BookHeart },
  { href: "/gallery", label: "Gallery", icon: GalleryVertical },
  { href: "/voice-notes", label: "Voice Notes", icon: Headphones },
  { href: "/future-letters", label: "Future Letters", icon: LockKeyhole },
  { href: "/profile", label: "Profile", icon: UserRound }
] as const;

