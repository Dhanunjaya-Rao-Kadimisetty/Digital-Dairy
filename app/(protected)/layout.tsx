import { AppShell } from "@/components/layout/app-shell";
import { getViewerOrRedirect } from "@/lib/auth/approved-users";
import { getNotifications, getUnreadNotificationsCount } from "@/lib/data/notifications";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getViewerOrRedirect();

  const [notifications, unreadCount] = await Promise.all([
    getNotifications(profile.id),
    getUnreadNotificationsCount(profile.id)
  ]);

  return (
    <AppShell
      profile={profile}
      notifications={notifications}
      unreadCount={unreadCount}
    >
      {children}
    </AppShell>
  );
}
