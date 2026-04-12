import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  className
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("glass-panel p-5", className)}>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-parchment/45">{label}</p>
          <p className="mt-3 font-serif text-4xl text-parchment">{value}</p>
        </div>
        <div className="grid size-11 place-items-center rounded-2xl bg-white/10">
          <Icon className="size-5 text-parchment" />
        </div>
      </div>
      <p className="text-sm leading-6 text-parchment/60">{detail}</p>
    </div>
  );
}

