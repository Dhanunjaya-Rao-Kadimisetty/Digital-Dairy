import Image from "next/image";

import { getInitials } from "@/lib/utils";

export function PersonPortrait({
  name,
  image,
  accent
}: {
  name: string;
  image?: string;
  accent: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="relative h-52 w-40 overflow-hidden rounded-[2rem] border border-white/10 bg-black/25 shadow-glow sm:h-64 sm:w-48">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-contain object-top p-2"
            sizes="(max-width: 640px) 160px, 192px"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center font-serif text-4xl text-parchment"
            style={{ background: accent }}
          >
            {getInitials(name)}
          </div>
        )}
      </div>
      <div>
        <p className="font-serif text-2xl text-parchment">{name}</p>
      </div>
    </div>
  );
}
