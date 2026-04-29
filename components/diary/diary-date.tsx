"use client";

import { useEffect, useState } from "react";
import { format, formatDistanceToNowStrict } from "date-fns";

export function DiaryDate({ date }: { date: string | Date }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same structure to avoid layout shift,
    // but without the specific time text to avoid hydration mismatch.
    return (
      <div className="flex items-center gap-3 text-sm text-parchment/50">
        <span className="h-4 w-32 animate-pulse rounded bg-white/5" />
        <span className="text-parchment/25">•</span>
        <span className="h-4 w-16 animate-pulse rounded bg-white/5" />
      </div>
    );
  }

  const d = new Date(date);
  const fullDate = format(d, "MMM d, yyyy 'at' h:mm a");
  const relative = formatDistanceToNowStrict(d, { addSuffix: true });

  return (
    <div className="flex items-center gap-3 text-sm text-parchment/50">
      <span>{fullDate}</span>
      <span className="text-parchment/25">•</span>
      <span>{relative}</span>
    </div>
  );
}
