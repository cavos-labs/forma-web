"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "../gsap-register";
import { useSite } from "../SiteProvider";
import { Reveal } from "../Reveal";

export default function WorkSlices() {
  const { copy } = useSite();
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const slices = copy.work.slices;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const items = gsap.utils.toArray<HTMLElement>(".work-slice");
        items.forEach((item, index) => {
          gsap.to(item, {
            flexGrow: index === active ? 1.7 : 1,
            duration: 0.75,
            ease: "power3.out",
          });
        });
      });
    },
    { scope: list, dependencies: [active] }
  );

  return (
    <section id="features" className="bg-[var(--bg)] px-4 py-24 md:px-8 md:py-32">
      <Reveal>
        <p className="mx-auto mb-8 max-w-[1400px] font-serif text-xl text-[var(--fg)] md:text-2xl">
          {copy.work.title}
        </p>
      </Reveal>

      <div
        ref={list}
        className="mx-auto flex max-w-[1400px] flex-col gap-3 md:h-[72vh] md:flex-row md:gap-0"
      >
        {slices.map((slice, index) => (
          <button
            key={slice.id}
            type="button"
            className="work-slice relative min-h-[42vh] w-full flex-1 cursor-pointer overflow-hidden text-left md:min-h-0"
            onMouseEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onClick={() => setActive(index)}
          >
            <Image
              src={slice.image}
              alt={slice.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 28vw, 100vw"
            />
            <span className="absolute inset-0 bg-[#373737]/25" />
          </button>
        ))}

        <div className="flex min-h-[28vh] flex-[1.35] flex-col justify-end bg-[var(--paper)] p-6 md:min-h-0 md:p-10">
          <h2 className="font-display text-[clamp(1.7rem,3.2vw,3.4rem)] uppercase leading-[1.05] tracking-tight text-[var(--ink)]">
            {slices[active].headline}
          </h2>
          <p className="mt-5 max-w-[36ch] font-serif text-base leading-relaxed text-[var(--ink)]/75">
            {slices[active].body}
          </p>
        </div>
      </div>
    </section>
  );
}
