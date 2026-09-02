"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, parallax, reveal, useSectionMotion } from "../gsap-register";
import { useSite } from "../SiteProvider";

export default function WorkSlices() {
  const { copy } = useSite();
  const root = useRef<HTMLElement>(null);
  const slices = copy.work.slices;

  useSectionMotion(
    root,
    () => {
      gsap.utils.toArray<HTMLElement>(".stack-card").forEach((card) => {
        parallax(card.querySelector(".stack-photo"), card);
        reveal(card.querySelectorAll(".stack-copy > *"), card);
      });
    },
    [copy.work.title]
  );

  return (
    <section id="features" ref={root} className="relative bg-[var(--bg)]">
      {slices.map((slice, index) => (
        <article
          key={slice.id}
          className="stack-card relative min-h-[78vh] overflow-hidden"
        >
          <Image
            src={slice.image}
            alt={slice.alt}
            fill
            className="stack-photo object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(55,55,55,0.15)_0%,rgba(55,55,55,0.72)_100%)]" />
          <div className="stack-copy relative z-10 mx-auto flex min-h-[78vh] max-w-[1400px] flex-col justify-end px-4 pb-16 md:px-8 md:pb-20">
            {index === 0 && (
              <p className="mb-6 text-xl text-[#F0F0F0] md:text-2xl">
                {copy.work.title}
              </p>
            )}
            <h2 className="max-w-[16ch] font-display text-[clamp(1.8rem,4vw,3.8rem)] uppercase leading-[1.05] tracking-tight text-[#F0F0F0]">
              {slice.headline}
            </h2>
            <p className="mt-5 max-w-[36ch] text-base leading-relaxed text-[#F0F0F0]/80 md:text-lg">
              {slice.body}
            </p>
          </div>
        </article>
      ))}
    </section>
  );
}
