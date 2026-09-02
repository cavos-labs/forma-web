"use client";

import { ArrowRight } from "@phosphor-icons/react";
import { WHATSAPP_HREF, PHONE_DISPLAY } from "@/lib/site";
import { useSite } from "../SiteProvider";
import { Reveal } from "../Reveal";

export default function Contact() {
  const { copy } = useSite();

  return (
    <section id="contact" className="bg-[var(--bg)] px-4 py-28 md:px-8 md:py-40">
      <Reveal className="mx-auto max-w-[52rem] text-center">
        <h2 className="font-display text-[clamp(3.2rem,8vw,6rem)] uppercase leading-[0.9] tracking-tight text-[var(--fg)]">
          {copy.contact.headline}
        </h2>
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
        <p className="mt-6 font-serif text-sm text-[color:color-mix(in_srgb,var(--fg)_55%,transparent)]">{PHONE_DISPLAY}</p>
        <p className="mx-auto mt-8 max-w-lg font-serif text-xs leading-relaxed text-[color:color-mix(in_srgb,var(--fg)_45%,transparent)]">
          {copy.contact.consent}{" "}
          <a href="/privacy" className="underline underline-offset-2">
            {copy.footer.privacy}
          </a>
        </p>
      </Reveal>
    </section>
  );
}
