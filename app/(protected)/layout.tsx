import { AppShell } from "@/components/layout/app-shell";
import { getViewerOrRedirect } from "@/lib/auth/approved-users";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProtectedLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getViewerOrRedirect();

  return <AppShell profile={profile}>{children}</AppShell>;
}
