import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="glass-panel flex min-h-72 flex-col items-center justify-center gap-4 px-8 py-12 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-white/10">
        <Icon className="size-6 text-parchment/80" />
      </div>
      <div className="space-y-2">
        <h3 className="font-serif text-3xl text-parchment">{title}</h3>
        <p className="max-w-md text-sm leading-7 text-parchment/60">{description}</p>
      </div>
      {action ?? null}
    </div>
  );
}

