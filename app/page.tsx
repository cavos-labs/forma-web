import { MarketingShell } from "./components/MarketingShell";
import Hero from "./components/landing/Hero";
import WorkSlices from "./components/landing/WorkSlices";
import Control from "./components/landing/Control";
import Sinpe from "./components/landing/Sinpe";
import Contact from "./components/landing/Contact";

export default function Home() {
  return (
    <MarketingShell overlayHeader>
      <main>
        <Hero />
        <WorkSlices />
        <Control />
        <Sinpe />
        <Contact />
      </main>
    </MarketingShell>
  );
}
