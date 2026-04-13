import { formatDistanceToNow } from "date-fns";
import { UserCheck, UserMinus } from "lucide-react";

import type { Profile } from "@/lib/types";
import { getInitials } from "@/lib/utils";

export function PartnerStatus({ profile }: { profile: Profile }) {
  const lastSeen = new Date(profile.last_seen_at);
  const isOnline = Date.now() - lastSeen.getTime() < 5 * 60 * 1000; // Online if active in last 5 mins

  return (
    <div className="glass-panel relative overflow-hidden p-5">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="grid size-12 place-items-center rounded-full bg-white/10 font-bold text-parchment">
            {getInitials(profile.name)}
          </div>
          <div 
            className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#2b1712] ${
              isOnline ? "bg-green-500" : "bg-gray-500"
            }`}
          />
        </div>
        <div className="flex-1">
          <p className="font-serif text-xl text-parchment">{profile.name}</p>
          <p className="text-xs text-parchment/60">
            {isOnline ? (
              <span className="flex items-center gap-1 text-green-400">
                <UserCheck className="size-3" /> Active now
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <UserMinus className="size-3" /> 
                Last seen {formatDistanceToNow(lastSeen, { addSuffix: true })}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
