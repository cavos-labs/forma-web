"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function refreshWhenImagesLoad(root: HTMLElement | null) {
  if (!root) return;
  root.querySelectorAll("img").forEach((img) => {
    if (img.complete) return;
    img.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  });
}

export function reveal(targets: gsap.TweenTarget, trigger: gsap.DOMTarget) {
  return gsap.from(targets, {
    y: 8,
    autoAlpha: 0,
    duration: 0.45,
    stagger: 0.06,
    ease: "power2.out",
    immediateRender: false,
    scrollTrigger: { trigger, start: "top 85%", once: true },
  });
}

export function parallax(target: gsap.TweenTarget, trigger: gsap.DOMTarget, shift = 6) {
  const cover = 1 + (shift * 2) / 100;
  return gsap.fromTo(
    target,
    { yPercent: -shift, scale: cover },
    {
      yPercent: shift,
      scale: cover,
      ease: "none",
      scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true },
    }
  );
}

export function useSectionMotion(
  root: RefObject<HTMLElement | null>,
  build: () => void,
  dependencies: unknown[] = []
) {
  useGSAP(
    () => {
      const frame = root.current;
      if (!frame) return;
      refreshWhenImagesLoad(frame);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", build);
      return () => mm.revert();
    },
    { scope: root, dependencies, revertOnUpdate: true }
  );
}

export { gsap, useGSAP, ScrollTrigger };
