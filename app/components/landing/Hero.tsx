"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowRight } from "@phosphor-icons/react";
import { gsap, parallax, useSectionMotion } from "../gsap-register";
import { useSite } from "../SiteProvider";

export default function Hero() {
  const { copy } = useSite();
  const root = useRef<HTMLElement>(null);

  useSectionMotion(root, () => {
    parallax(".hero-photo", root.current!, 5);
    gsap.from(".hero-copy > *", {
      y: 10,
      autoAlpha: 0,
      duration: 0.5,
      stagger: 0.07,
      ease: "power2.out",
    });
  });

  return (
    <section data-hero ref={root} className="relative bg-[var(--ink)]">
      <div className="relative min-h-[100dvh] overflow-hidden">
        <Image
          src="/images/hero-gym.png"
          alt="Stacked plates and a bench on an empty gym floor"
          fill
          priority
          className="hero-photo object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(55,55,55,0.28)_0%,rgba(55,55,55,0.45)_50%,rgba(55,55,55,0.78)_100%)]" />

        <div className="hero-copy relative z-10 mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col items-start justify-end px-4 pb-16 pt-28 md:px-8 md:pb-20">
          <h1 className="max-w-[13ch] font-display text-[clamp(2.75rem,7vw,5.5rem)] uppercase leading-[0.92] tracking-[-0.02em] text-[#F0F0F0]">
            {copy.hero.headline}
          </h1>
          <p className="mt-6 max-w-[34ch] text-lg leading-relaxed text-[#F0F0F0]/80 md:text-xl">
            {copy.hero.line}
          </p>
          <a
            href="/pricing"
            className="group mt-10 inline-flex w-fit items-center gap-3 bg-[#F0F0F0] px-6 py-3 text-[#373737] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
          >
            <span className="text-[13px] font-medium uppercase">
              {copy.hero.cta}
            </span>
            <span className="flex h-7 w-7 items-center justify-center bg-[#373737]/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
              <ArrowRight size={14} weight="light" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
