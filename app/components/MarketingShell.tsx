"use client";

import Header from "./Header";
import Footer from "./Footer";
import { SiteProvider, useSite } from "./SiteProvider";

function Frame({
  children,
  overlayHeader,
}: {
  children: React.ReactNode;
  overlayHeader: boolean;
}) {
  const { theme } = useSite();

  return (
    <div className={theme === "dark" ? "theme-dark" : "theme-light"}>
      <Header overlay={overlayHeader} />
      {children}
      <Footer />
    </div>
  );
}

export function MarketingShell({
  children,
  overlayHeader = false,
}: {
  children: React.ReactNode;
  overlayHeader?: boolean;
}) {
  return (
    <SiteProvider>
      <Frame overlayHeader={overlayHeader}>{children}</Frame>
    </SiteProvider>
  );
}
