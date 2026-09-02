"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";
import { MarketingShell } from "../components/MarketingShell";
import { useSite } from "../components/SiteProvider";
import { Reveal } from "../components/Reveal";
import { WHATSAPP_HREF } from "@/lib/site";

type PricingData = {
  monthly: number;
  yearly: number;
  currency: string;
  symbol: string;
  exchangeRate?: number;
};

function PricingBody() {
  const { copy, language } = useSite();
  const [currency, setCurrency] = useState<"USD" | "CRC">("USD");
  const [pricing, setPricing] = useState<PricingData>({
    monthly: 51,
    yearly: 549,
    currency: "USD",
    symbol: "$",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/currency?currency=${currency}`)
      .then((response) => response.json())
      .then((data: PricingData) => {
        if (!cancelled) setPricing(data);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [currency]);

  const monthlySavings = Math.round((pricing.monthly * 12 - pricing.yearly) / 12);

  return (
    <main className="px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-2 lg:items-start">
        <Reveal>
          <h1 className="font-display text-[clamp(2.6rem,6vw,6rem)] uppercase leading-[0.9] tracking-tight text-[var(--fg)]">
            {copy.pricing.headline}
          </h1>
          <div className="mt-10 flex gap-6 font-display text-[13px] uppercase tracking-[0.14em]">
            {(["USD", "CRC"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setCurrency(code)}
                className="cursor-pointer pb-1"
                style={{
                  boxShadow:
                    currency === code ? "inset 0 -2px 0 var(--fg)" : "none",
                  opacity: currency === code ? 1 : 0.45,
                }}
              >
                {code}
              </button>
            ))}
          </div>
          <p className="mt-6 font-serif text-base text-[color:color-mix(in_srgb,var(--fg)_65%,transparent)]">
            {copy.pricing.monthlyHint}{" "}
            {loading ? "…" : `${pricing.symbol}${pricing.monthly.toLocaleString()} ${copy.pricing.perMonth}`}
          </p>
        </Reveal>

        <Reveal className="border-t border-[color:color-mix(in_srgb,var(--fg)_16%,transparent)] pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
          <p className="font-display text-[13px] uppercase tracking-[0.14em] text-[var(--fg)]">
            {copy.pricing.yearly}
          </p>
          <div className="mt-4 font-serif text-[clamp(3.4rem,8vw,6.5rem)] leading-none text-[var(--fg)]">
            {loading ? (
              <span className="inline-block h-[0.8em] w-40 animate-pulse bg-[color:color-mix(in_srgb,var(--fg)_12%,transparent)]" />
            ) : (
              <>
                {pricing.symbol}
                {pricing.yearly.toLocaleString()}
              </>
            )}
          </div>
          <p className="mt-2 font-display text-[12px] uppercase tracking-[0.16em] text-[color:color-mix(in_srgb,var(--fg)_55%,transparent)]">
            {copy.pricing.perYear}
          </p>
          {monthlySavings > 0 && (
            <p className="mt-6 font-display text-[12px] uppercase tracking-[0.16em] text-[var(--fg)]">
              {copy.pricing.saveTwoMonths}
            </p>
          )}

          <ul className="mt-10">
            {copy.pricing.features.map((feature) => (
              <li
                key={feature}
                className="border-b border-[color:color-mix(in_srgb,var(--fg)_12%,transparent)] py-4 font-serif text-base text-[var(--fg)] first:border-t"
              >
                {feature}
              </li>
            ))}
          </ul>

          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex items-center gap-3 bg-[var(--fg)] px-6 py-3 text-[var(--bg)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
          >
            <span className="font-display text-[13px] uppercase tracking-[0.14em]">
              {copy.pricing.getStarted}
            </span>
            <span className="flex h-7 w-7 items-center justify-center bg-[var(--bg)]/10 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5">
              <ArrowRight size={14} weight="light" />
            </span>
          </a>

          {currency === "CRC" && pricing.exchangeRate && (
            <p className="mt-8 font-serif text-xs text-[color:color-mix(in_srgb,var(--fg)_50%,transparent)]">
              {language === "ES"
                ? `Tipo de cambio: $1 USD = ₡${pricing.exchangeRate.toFixed(2)} CRC`
                : `Exchange rate: $1 USD = ₡${pricing.exchangeRate.toFixed(2)} CRC`}
            </p>
          )}
        </Reveal>
      </div>
    </main>
  );
}

export default function PricingPage() {
  return (
    <MarketingShell>
      <PricingBody />
    </MarketingShell>
  );
}
