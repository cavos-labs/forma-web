"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, refreshWhenImagesLoad, useGSAP } from "../gsap-register";
import { useSite } from "../SiteProvider";

export default function WorkSlices() {
  const { copy } = useSite();
  const root = useRef<HTMLElement>(null);
  const slices = copy.work.slices;

  useGSAP(
    () => {
      const frame = root.current;
      if (!frame) return;
      refreshWhenImagesLoad(frame);

      const cards = gsap.utils.toArray<HTMLElement>(".stack-card");
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        cards.forEach((card, index) => {
          gsap.from(card.querySelector(".stack-copy"), {
            y: 40,
            duration: 1,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: card,
              start: index === 0 ? "top 90%" : "top 75%",
              once: true,
              refreshPriority: 1,
            },
          });
          if (index === cards.length - 1) return;
          gsap.to(card, {
            scale: 0.92,
            transformOrigin: "center top",
            ease: "none",
            scrollTrigger: {
              trigger: cards[index + 1],
              start: "top bottom",
              end: "top top",
              scrub: true,
              refreshPriority: 1,
            },
          });
        });
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        cards.forEach((card) => {
          gsap.from(card.querySelector(".stack-copy"), {
            y: 32,
            duration: 0.9,
            ease: "power3.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: card,
              start: "top 75%",
              once: true,
              refreshPriority: 1,
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [copy.work.title], revertOnUpdate: true }
  );

  return (
    <section id="features" ref={root} className="relative bg-[var(--bg)]">
      {slices.map((slice, index) => (
        <article
          key={slice.id}
          className="stack-card relative min-h-[100dvh] overflow-hidden md:sticky md:top-0"
          style={{ zIndex: index + 1 }}
        >
          <Image
            src={slice.image}
            alt={slice.alt}
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(55,55,55,0.15)_0%,rgba(55,55,55,0.72)_100%)]" />
          <div className="stack-copy relative z-10 mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-end px-4 pb-16 md:px-8 md:pb-20">
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
