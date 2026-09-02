"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "./gsap-register";

export function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current, {
          y: 28,
          duration: 1.05,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            once: true,
          },
        });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
