"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import { gsap, useGSAP } from "../gsap-register";
import { useSite } from "../SiteProvider";

export default function Hero() {
  const { copy } = useSite();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(".hero-photo", { scale: 1.08, duration: 2.2, ease: "power2.out" }, 0)
          .from(".hero-copy > *", { y: 24, duration: 0.9, stagger: 0.12, immediateRender: false }, 0.15);
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative min-h-[100dvh] overflow-hidden bg-[var(--ink)]">
      <Image
        src="/images/hero-gym.png"
        alt="Empty gym floor at first light"
        fill
        priority
        className="hero-photo object-cover object-[18%_78%]"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(55,55,55,0.42)_0%,rgba(55,55,55,0.58)_42%,rgba(55,55,55,0.88)_100%)]" />

      <div className="hero-copy relative z-10 mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col justify-end px-4 pb-16 pt-28 md:px-8 md:pb-20">
        <img
          src="/images/forma-logo-white.png"
          alt="FORMA"
          className="h-16 w-auto origin-left md:h-24 lg:h-[7.5rem]"
        />
        <p className="mt-6 max-w-[28ch] font-serif text-lg text-[#F0F0F0] md:text-xl">
          {copy.hero.line}
        </p>
        <a
          href="/pricing"
          className="group mt-8 inline-flex w-fit items-center gap-3 bg-[#F0F0F0] px-6 py-3 text-[#373737] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
        >
          <span className="font-display text-[13px] uppercase tracking-[0.14em]">
            {copy.hero.cta}
          </span>
          <span className="flex h-7 w-7 items-center justify-center bg-[#373737]/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
            <ArrowRight size={14} weight="light" />
          </span>
        </a>
      </div>
    </section>
  );
}
