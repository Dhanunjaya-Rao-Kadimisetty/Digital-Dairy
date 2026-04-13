"use client";

import { useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function PresenceTracker() {
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    
    // Update last seen every 2 minutes
    const updateLastSeen = async () => {
      await supabase.rpc('update_last_seen');
    };

    updateLastSeen();
    const interval = setInterval(updateLastSeen, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
