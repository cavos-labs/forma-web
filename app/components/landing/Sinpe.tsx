"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, refreshWhenImagesLoad, useGSAP } from "../gsap-register";
import { useSite } from "../SiteProvider";

export default function Sinpe() {
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
          ".sinpe-photo",
          { scale: 1.16, xPercent: 8 },
          {
            scale: 1,
            xPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: frame,
              start: "top 80%",
              end: "center center",
              scrub: 1,
              refreshPriority: 3,
            },
          }
        );
        gsap.from(".sinpe-copy > *", {
          y: 36,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".sinpe-copy",
            start: "top 80%",
            once: true,
            refreshPriority: 3,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className="grid md:grid-cols-2">
      <div className="sinpe-copy flex min-h-[70vw] flex-col justify-center bg-[var(--ink)] px-4 py-20 md:min-h-[85vh] md:px-12 lg:px-16">
        <h2 className="max-w-[12ch] font-display text-[clamp(2rem,4.2vw,4.4rem)] uppercase leading-[0.95] tracking-tight text-[var(--paper)]">
          {copy.sinpe.headline}
        </h2>
        <p className="mt-6 max-w-[32ch] font-serif text-lg leading-relaxed text-[var(--paper)]/75">
          {copy.sinpe.body}
        </p>
      </div>
      <div className="relative min-h-[70vw] overflow-hidden bg-[var(--paper)] md:min-h-[85vh]">
        <Image
          src="/images/sinpe-phone.png"
          alt="Phone on a wooden counter showing a payment confirmation"
          fill
          className="sinpe-photo object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
      </div>
    </section>
  );
}
