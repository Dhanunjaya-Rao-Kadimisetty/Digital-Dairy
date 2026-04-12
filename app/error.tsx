"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="grid min-h-screen place-items-center bg-cedar px-4 text-parchment">
        <div className="glass-panel max-w-xl space-y-5 px-8 py-10 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-parchment/50">
            Something slipped
          </p>
          <h1 className="font-serif text-4xl">The diary needs a fresh breath.</h1>
          <p className="text-sm leading-7 text-parchment/65">{error.message}</p>
          <button className="soft-button" onClick={() => reset()}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

