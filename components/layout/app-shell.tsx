import type { Notification, Profile } from "@/lib/types";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LogoutButton } from "@/components/layout/logout-button";
import { Sidebar } from "@/components/layout/sidebar";
import { getInitials } from "@/lib/utils";
import { PresenceTracker } from "@/components/auth/presence-tracker";
import { NotificationBell } from "@/components/notifications/notification-bell";

export function AppShell({
  profile,
  notifications,
  unreadCount,
  children
}: {
  profile: Profile;
  notifications: Notification[];
  unreadCount: number;
  children: React.ReactNode;
}) {
  return (
    <div className="page-shell min-h-screen border-4 border-gold pb-24 xl:pb-12">
      <div className="fixed bottom-24 left-6 z-[9999]">
        <NotificationBell
          userId={profile.id}
          initialCount={unreadCount}
          initialNotifications={notifications}
        />
      </div>
      <PresenceTracker />
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <div className="hidden xl:block">
          <Sidebar
            profile={profile}
            notifications={notifications}
            unreadCount={unreadCount}
          />
        </div>
        <div className="space-y-6">
          <header className="glass-panel flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-4">
              <div className="grid size-12 place-items-center rounded-full bg-white/10 font-semibold text-parchment xl:hidden">
                {getInitials(profile.name)}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-parchment/45">
                  Private room
                </p>
                <p className="font-serif text-2xl text-parchment">
                  Welcome back, {profile.name.split(" ")[0]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LogoutButton />
            </div>
          </header>
          <div>{children}</div>
        </div>
      </div>
      <MobileNav
        profile={profile}
        notifications={notifications}
        unreadCount={unreadCount}
      />
    </div>
  );
}
