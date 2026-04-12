import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNowStrict, isAfter } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFullDate(value: string | Date) {
  return format(new Date(value), "MMMM d, yyyy");
}

export function formatDateTime(value: string | Date) {
  return format(new Date(value), "MMM d, yyyy 'at' h:mm a");
}

export function fromNow(value: string | Date) {
  return formatDistanceToNowStrict(new Date(value), { addSuffix: true });
}

export function isLocked(unlockDate: string) {
  return isAfter(new Date(unlockDate), new Date());
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function slugifyFilename(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

