"use client";

import Image from "next/image";
import { useSite } from "../SiteProvider";
import { Reveal } from "../Reveal";

export default function Control() {
  const { copy } = useSite();

  return (
    <section className="bg-[var(--bg)]">
      <div className="mx-auto grid max-w-[1400px] md:grid-cols-[1.4fr_1fr]">
        <div className="relative min-h-[70vw] md:min-h-[85vh]">
          <Image
            src="/images/control-desk.png"
            alt="Front desk in late afternoon light"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 58vw, 100vw"
          />
        </div>
        <Reveal className="flex flex-col justify-center border-t border-[color:color-mix(in_srgb,var(--fg)_14%,transparent)] px-4 py-16 md:border-t-0 md:border-l md:px-12 lg:px-16">
          <h2 className="font-display text-[clamp(1.8rem,3.4vw,3.6rem)] uppercase leading-[1.05] tracking-tight text-[var(--fg)]">
            {copy.control.headline}
          </h2>
          <p className="mt-6 max-w-[34ch] font-serif text-lg leading-relaxed text-[color:color-mix(in_srgb,var(--fg)_75%,transparent)]">
            {copy.control.body}
          </p>
          <a
            href="/pricing"
            className="mt-10 w-fit font-serif text-lg underline underline-offset-4 text-[var(--fg)]"
          >
            {copy.control.link}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
