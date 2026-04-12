"use client";

import dynamic from "next/dynamic";

const EmotionalParticles = dynamic(
  () =>
    import("@/components/backgrounds/emotional-particles").then(
      (module) => module.EmotionalParticles
    ),
  {
    ssr: false
  }
);

export function AmbientParticles() {
  return (
    <div className="hidden lg:block">
      <EmotionalParticles />
    </div>
  );
}
