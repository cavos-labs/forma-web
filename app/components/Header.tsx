"use client";

import { useEffect, useState } from "react";
import { List, Moon, Sun, X } from "@phosphor-icons/react";
import { COPY, type Language } from "@/lib/site";
import { ScrollTrigger, useGSAP } from "./gsap-register";
import { useOptionalSite } from "./SiteProvider";

export type HeaderProps = {
  currentLanguage?: Language;
  onLanguageChange?: (language: Language) => void;
  isDark?: boolean;
  onThemeToggle?: () => void;
  overlay?: boolean;
};

export default function Header({
  currentLanguage,
  onLanguageChange,
  isDark = true,
  onThemeToggle,
  overlay = false,
}: HeaderProps) {
  const site = useOptionalSite();
  const language = currentLanguage ?? site?.language ?? "EN";
  const dark = overlay
    ? true
    : site
      ? site.theme === "dark"
      : Boolean(onThemeToggle) && isDark;
  const copy = COPY[language];
  const setLanguage = onLanguageChange ?? site?.setLanguage;
  const toggleTheme = onThemeToggle ?? site?.toggleTheme;

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const [solid, setSolid] = useState(false);

  useGSAP(
    () => {
      if (!overlay) return;
      const trigger = document.querySelector("[data-nav-solid]");
      if (!trigger) return;
      ScrollTrigger.create({
        trigger,
        start: "top 64px",
        refreshPriority: 20,
        onEnter: () => setSolid(true),
        onLeaveBack: () => setSolid(false),
      });
    },
    { dependencies: [overlay] }
  );

  const fg = dark ? "#F0F0F0" : "#373737";
  const bg = dark ? "#373737" : "#F0F0F0";
  const iconSrc = dark ? "/images/forma-icon-white.png" : "/images/forma-icon-black.png";

  const links = [
    { label: copy.nav.features, href: "/#features" },
    { label: copy.nav.contact, href: "/#contact" },
    { label: copy.nav.pricing, href: "/pricing" },
  ];

  const closeMenu = () => {
    setMenuClosing(true);
    window.setTimeout(() => {
      setMenuOpen(false);
      setMenuClosing(false);
    }, 280);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollToHash = (href: string) => {
    if (!href.includes("#")) return;
    const id = href.split("#")[1];
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header
        className={`z-40 ${
          overlay ? "fixed inset-x-0 top-0 transition-[background-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" : "relative"
        } ${overlay && solid ? "bg-[#373737]/90" : ""}`}
      >
        <nav
          className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:h-[72px] md:px-8"
          style={{ color: fg }}
        >
          <a href="/" className="flex items-center" aria-label="FORMA">
            <img src={iconSrc} alt="" width={320} height={345} className="h-6 w-auto md:h-7" />
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium uppercase transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-60"
                onClick={(event) => {
                  if (link.href.startsWith("/#")) {
                    event.preventDefault();
                    scrollToHash(link.href);
                  }
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {toggleTheme && (
              <button
                type="button"
                onClick={toggleTheme}
                className="cursor-pointer p-1 transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:opacity-60"
                aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
              >
                {dark ? <Sun size={18} weight="light" /> : <Moon size={18} weight="light" />}
              </button>
            )}

            {setLanguage && (
              <div className="flex items-center gap-1 text-sm">
                <button
                  type="button"
                  onClick={() => setLanguage("EN")}
                  className="cursor-pointer px-2 py-2 transition-opacity duration-500"
                  style={{ opacity: language === "EN" ? 1 : 0.45 }}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("ES")}
                  className="cursor-pointer px-2 py-2 transition-opacity duration-500"
                  style={{ opacity: language === "ES" ? 1 : 0.45 }}
                >
                  ES
                </button>
              </div>
            )}

            <button
              type="button"
              className="cursor-pointer p-2 lg:hidden"
              aria-label={copy.nav.menu}
              onClick={() => setMenuOpen(true)}
            >
              <List size={22} weight="light" />
            </button>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className={`absolute inset-0 bg-black/50 ${menuClosing ? "animate-fade-out" : "animate-fade-in"}`}
            aria-label={copy.nav.close}
            onClick={closeMenu}
          />
          <div
            className={`absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col ${menuClosing ? "animate-panel-out" : "animate-panel-in"}`}
            style={{ backgroundColor: bg, color: fg }}
          >
            <div className="flex items-center justify-between border-b px-6 py-6" style={{ borderColor: `${fg}22` }}>
              <img src={iconSrc} alt="" width={320} height={345} className="h-6 w-auto" />
              <button type="button" onClick={closeMenu} className="cursor-pointer" aria-label={copy.nav.close}>
                <X size={22} weight="light" />
              </button>
            </div>
            <div className="flex flex-1 flex-col justify-center gap-6 px-6">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-4xl font-medium uppercase leading-none"
                  onClick={(event) => {
                    if (link.href.startsWith("/#")) {
                      event.preventDefault();
                      scrollToHash(link.href);
                    }
                    closeMenu();
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
