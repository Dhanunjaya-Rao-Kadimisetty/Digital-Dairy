"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import { Toaster } from "sonner";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      {children}
      <Toaster
        position="top-right"
        richColors
        theme="dark"
        toastOptions={{
          classNames: {
            toast:
              "!rounded-2xl !border !border-white/10 !bg-[#241612]/95 !text-parchment"
          }
        }}
      />
    </LazyMotion>
  );
}

