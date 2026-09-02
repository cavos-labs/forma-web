"use client";

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

export { gsap, useGSAP, ScrollTrigger };
