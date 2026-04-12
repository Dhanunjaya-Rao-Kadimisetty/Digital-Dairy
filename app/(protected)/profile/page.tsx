import { ShieldCheck, Sparkles, UserRound } from "lucide-react";

import { ProfileForm } from "@/components/forms/profile-form";
import { PageIntro } from "@/components/ui/page-intro";
import { SectionCard } from "@/components/ui/section-card";
import { StatCard } from "@/components/ui/stat-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getViewerOrRedirect } from "@/lib/auth/approved-users";
import { getProfileSnapshot } from "@/lib/data/profile";
import { getInitials } from "@/lib/utils";

export default async function ProfilePage() {
  const { profile, user } = await getViewerOrRedirect();
  const stats = await getProfileSnapshot(profile);

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Profile"
        title="Your place in this little archive."
        description="Keep your display details current and see how you interact with the diary over time."
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <SectionCard className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="grid size-20 place-items-center rounded-full bg-white/10 font-serif text-3xl text-parchment">
              {getInitials(profile.name)}
            </div>
            <div>
              <h2 className="font-serif text-4xl text-parchment">{profile.name}</h2>
              <p className="mt-2 text-sm text-parchment/60">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <StatusBadge variant="accent">writer & reader</StatusBadge>
            <StatusBadge>Approved account</StatusBadge>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl border border-white/10 bg-black/15 p-5">
              <div className="inline-flex items-center gap-2 text-[#ffd9ba]">
                <ShieldCheck className="size-4" />
                <span className="text-sm font-medium">Access level</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-parchment/65">
                This diary is protected by Supabase authentication, approved-email checks,
                and Row Level Security.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/15 p-5">
              <div className="inline-flex items-center gap-2 text-[#ffd9ba]">
                <Sparkles className="size-4" />
                <span className="text-sm font-medium">Personal touch</span>
              </div>
              <p className="mt-3 text-sm leading-7 text-parchment/65">
                Update the display name or avatar link so the diary feels even more like yours.
              </p>
            </div>
          </div>
        </SectionCard>

        <div className="space-y-6">
          <div className="grid gap-5 sm:grid-cols-3">
            <StatCard
              label="Entries"
              value={stats.entries}
              detail="Written by this account."
              icon={UserRound}
            />
            <StatCard
              label="Comments"
              value={stats.comments}
              detail="Notes left inside the diary."
              icon={Sparkles}
            />
            <StatCard
              label="Reactions"
              value={stats.reactions}
              detail="Emoji touches added across entries."
              icon={ShieldCheck}
            />
          </div>

          <SectionCard className="space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-parchment/45">
                Edit profile
              </p>
              <h2 className="mt-3 font-serif text-3xl text-parchment">Update your details</h2>
            </div>
            <ProfileForm profile={profile} />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
