export default function Loading() {
  return (
    <main className="page-shell flex min-h-screen items-center justify-center">
      <div className="glass-panel flex w-full max-w-lg flex-col items-center gap-4 px-8 py-12 text-center">
        <div className="size-14 animate-pulse rounded-full bg-white/10" />
        <div className="space-y-2">
          <p className="font-serif text-3xl text-parchment">Warming the room...</p>
          <p className="text-sm text-parchment/65">
            Loading your private space and latest keepsakes.
          </p>
        </div>
      </div>
    </main>
  );
}

