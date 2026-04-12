import Link from "next/link";

export default function NotFound() {
  return (
    <main className="page-shell grid min-h-screen place-items-center">
      <div className="glass-panel max-w-xl space-y-5 px-8 py-10 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-parchment/50">
          Page not found
        </p>
        <h1 className="font-serif text-4xl text-parchment">This memory is not here.</h1>
        <p className="text-sm leading-7 text-parchment/65">
          The page may have moved, been removed, or never existed in your private diary.
        </p>
        <Link href="/dashboard" className="soft-button">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}

