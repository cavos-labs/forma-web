"use client";

import Link from "next/link";
import { EMAIL, LOCATION, PHONE_DISPLAY } from "@/lib/site";
import { useSite } from "./SiteProvider";

export default function Footer() {
  const { copy, theme } = useSite();

  return (
    <footer className="border-t border-[color:color-mix(in_srgb,var(--fg)_18%,transparent)] px-4 py-16 md:px-8">
      <div className="mx-auto grid max-w-[1400px] gap-12 md:grid-cols-3">
        <div className="space-y-4">
          <img
            src={theme === "dark" ? "/images/forma-icon-white.png" : "/images/forma-icon-black.png"}
            alt=""
            className="h-8 w-8"
          />
          <p className="font-serif text-lg leading-snug text-[var(--fg)]">
            {copy.footer.tagline}
          </p>
        </div>

        <div className="space-y-2 font-serif text-sm text-[color:color-mix(in_srgb,var(--fg)_72%,transparent)]">
          <div>{PHONE_DISPLAY}</div>
          <div>{EMAIL}</div>
          <div>{LOCATION}</div>
        </div>

        <div className="space-y-2 font-serif text-sm">
          <Link href="/privacy" className="block underline underline-offset-4">
            {copy.footer.privacy}
          </Link>
          <Link href="/terms" className="block underline underline-offset-4">
            {copy.footer.terms}
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-[1400px] space-y-4 border-t border-[color:color-mix(in_srgb,var(--fg)_18%,transparent)] pt-8">
        <p className="max-w-3xl font-serif text-xs leading-relaxed text-[color:color-mix(in_srgb,var(--fg)_55%,transparent)]">
          {copy.footer.whatsappPolicy}
        </p>
        <p className="font-serif text-xs text-[color:color-mix(in_srgb,var(--fg)_45%,transparent)]">
          © 2026 FORMA Costa Rica. {copy.footer.rights}
        </p>
      </div>
    </footer>
  );
}
