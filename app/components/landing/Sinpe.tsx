"use client";

import Image from "next/image";
import { useSite } from "../SiteProvider";
import { Reveal } from "../Reveal";

export default function Sinpe() {
  const { copy } = useSite();

  return (
    <section className="grid md:grid-cols-2">
      <Reveal className="flex min-h-[70vw] flex-col justify-center bg-[var(--ink)] px-4 py-20 md:min-h-[85vh] md:px-12 lg:px-16">
        <h2 className="max-w-[12ch] font-display text-[clamp(2rem,4.2vw,4.4rem)] uppercase leading-[0.95] tracking-tight text-[var(--paper)]">
          {copy.sinpe.headline}
        </h2>
        <p className="mt-6 max-w-[32ch] font-serif text-lg leading-relaxed text-[var(--paper)]/75">
          {copy.sinpe.body}
        </p>
      </Reveal>
      <div className="relative min-h-[70vw] bg-[var(--paper)] md:min-h-[85vh]">
        <Image
          src="/images/sinpe-phone.png"
          alt="Phone on a wooden counter showing a payment confirmation"
          fill
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
    </section>
  );
}
