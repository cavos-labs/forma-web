"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, refreshWhenImagesLoad, useGSAP } from "../gsap-register";
import { useSite } from "../SiteProvider";

export default function Control() {
  const { copy } = useSite();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const frame = root.current;
      if (!frame) return;
      refreshWhenImagesLoad(frame);

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".control-photo",
          { yPercent: -8, scale: 1.2 },
          {
            yPercent: 8,
            scale: 1.2,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
              refreshPriority: 2,
            },
          }
        );
        gsap.from(".control-copy > *", {
          y: 36,
          duration: 1,
          stagger: 0.08,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".control-copy",
            start: "top 80%",
            once: true,
            refreshPriority: 2,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section data-nav-solid ref={root} className="bg-[var(--bg)]">
      <div className="mx-auto grid max-w-[1400px] md:grid-cols-[1.4fr_1fr]">
        <div className="relative min-h-[70vw] overflow-hidden md:min-h-[85vh]">
          <Image
            src="/images/control-desk.png"
            alt="Front desk in late afternoon light"
            fill
            className="control-photo object-cover"
            sizes="(min-width: 768px) 58vw, 100vw"
          />
        </div>
        <div className="control-copy flex flex-col justify-center border-t border-[color:color-mix(in_srgb,var(--fg)_14%,transparent)] px-4 py-16 md:border-t-0 md:border-l md:px-12 lg:px-16">
          <h2 className="font-display text-[clamp(1.8rem,3.4vw,3.6rem)] uppercase leading-[1.05] tracking-tight text-[var(--fg)]">
            {copy.control.headline}
          </h2>
          <p className="mt-6 max-w-[34ch] text-lg leading-relaxed text-[color:color-mix(in_srgb,var(--fg)_75%,transparent)]">
            {copy.control.body}
          </p>
          <a
            href="/pricing"
            className="mt-10 w-fit text-lg underline underline-offset-4 text-[var(--fg)]"
          >
            {copy.control.link}
          </a>
        </div>
      </div>
    </section>
  );
}
