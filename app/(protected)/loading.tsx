export default function ProtectedLoading() {
  return (
    <div className="space-y-6">
      <div className="glass-panel h-40 animate-pulse" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="glass-panel h-40 animate-pulse" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-panel h-96 animate-pulse" />
        <div className="glass-panel h-96 animate-pulse" />
      </div>
    </div>
  );
}
