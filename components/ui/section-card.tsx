import { cn } from "@/lib/utils";

export function SectionCard({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("glass-panel p-5 sm:p-6", className)}>{children}</section>;
}
