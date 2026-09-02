"use client";

import { useRef } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { WHATSAPP_HREF, PHONE_DISPLAY } from "@/lib/site";
import { gsap, useGSAP } from "../gsap-register";
import { useSite } from "../SiteProvider";

export default function Contact() {
  const { copy } = useSite();
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const frame = root.current;
      if (!frame) return;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".contact-title",
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            ease: "none",
            scrollTrigger: {
              trigger: ".contact-title",
              start: "top 88%",
              end: "top 52%",
              scrub: 1,
              refreshPriority: 4,
            },
          }
        );
        gsap.from(".contact-rest > *", {
          y: 24,
          duration: 0.85,
          stagger: 0.08,
          ease: "power3.out",
          immediateRender: false,
          scrollTrigger: {
            trigger: ".contact-rest",
            start: "top 85%",
            once: true,
            refreshPriority: 4,
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section id="contact" ref={root} className="bg-[var(--bg)] px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-[52rem] text-center">
        <h2 className="contact-title overflow-hidden font-display text-[clamp(3.2rem,8vw,6rem)] uppercase leading-[0.9] tracking-tight text-[var(--fg)]">
          {copy.contact.headline}
        </h2>
        <div className="contact-rest">
          <p className="mt-6 font-serif text-lg text-[color:color-mix(in_srgb,var(--fg)_80%,transparent)] md:text-xl">
            {copy.contact.body}
          </p>
          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-3 bg-[var(--fg)] px-6 py-3 text-[var(--bg)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
          >
            <span className="font-display text-[13px] uppercase tracking-[0.14em]">
              {copy.contact.cta}
            </span>
            <span className="flex h-7 w-7 items-center justify-center bg-[var(--bg)]/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
              <ArrowRight size={14} weight="light" />
            </span>
          </a>
          <p className="mt-6 font-serif text-sm text-[color:color-mix(in_srgb,var(--fg)_55%,transparent)]">
            {PHONE_DISPLAY}
          </p>
          <p className="mx-auto mt-8 max-w-lg font-serif text-xs leading-relaxed text-[color:color-mix(in_srgb,var(--fg)_45%,transparent)]">
            {copy.contact.consent}{" "}
            <a href="/privacy" className="underline underline-offset-2">
              {copy.footer.privacy}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
