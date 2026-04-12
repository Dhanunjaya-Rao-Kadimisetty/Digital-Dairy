export function LogoMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#ffeadf]/25 via-[#e6b798]/15 to-transparent shadow-glow">
        <span className="font-serif text-xl font-semibold text-parchment">D</span>
      </div>
      <div>
        <p className="font-serif text-xl font-semibold text-parchment">Digital Diary</p>
        <p className="text-xs uppercase tracking-[0.35em] text-parchment/45">
          private keepsakes
        </p>
      </div>
    </div>
  );
}

