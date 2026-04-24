"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigation } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/notifications/notification-bell";
import type { Notification, Profile } from "@/lib/types";

export function MobileNav({
  profile,
  notifications,
  unreadCount
}: {
  profile: Profile;
  notifications: Notification[];
  unreadCount: number;
}) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-30 rounded-full border border-white/10 bg-[#2a1712]/90 p-2 shadow-glow backdrop-blur xl:hidden">
      <div className="grid grid-cols-7 gap-1">
        <div className="flex flex-col items-center justify-center">
          <NotificationBell
            userId={profile.id}
            initialCount={unreadCount}
            initialNotifications={notifications}
          />
        </div>
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 rounded-full px-2 py-2 text-[11px] text-parchment/45",
                isActive && "bg-white/10 text-parchment"
              )}
            >
              <Icon className="size-4" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

