"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigation } from "@/lib/constants";
import type { Profile } from "@/lib/types";
import { cn, getInitials } from "@/lib/utils";
import { LogoMark } from "@/components/ui/logo-mark";

type SidebarProps = {
  profile: Profile;
};

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="glass-panel flex h-full flex-col justify-between p-5">
      <div className="space-y-8">
        <LogoMark />

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-parchment/65 transition hover:bg-white/8 hover:text-parchment",
                  isActive && "bg-white/10 text-parchment"
                )}
              >
                <Icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/15 p-4">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-full bg-white/10 font-semibold text-parchment">
            {getInitials(profile.name)}
          </div>
          <div>
            <p className="font-medium text-parchment">{profile.name}</p>
            <p className="text-xs uppercase tracking-[0.28em] text-parchment/45">
              {profile.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

