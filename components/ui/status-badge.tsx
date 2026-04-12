import { cn } from "@/lib/utils";

export function StatusBadge({
  children,
  variant = "default"
}: {
  children: React.ReactNode;
  variant?: "default" | "accent" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs uppercase tracking-[0.22em]",
        variant === "default" && "border-white/10 bg-white/10 text-parchment/70",
        variant === "accent" && "border-gold/25 bg-gold/10 text-[#ffd9ba]",
        variant === "muted" && "border-white/10 bg-black/20 text-parchment/50"
      )}
    >
      {children}
    </span>
  );
}

