"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { HeroSection } from "@/components/hero/HeroSection";
import type { YouTubeVideo } from "@/lib/youtube";

const SESSION_KEY = "us-architectural-preloader-v2";

const UltimateStudiosPreloader = dynamic(
  () =>
    import("@/components/preloader/UltimateStudiosPreloader").then(
      (m) => m.UltimateStudiosPreloader
    ),
  { ssr: false }
);

const StudioCtaSection = dynamic(
  () =>
    import("@/components/cta/StudioCtaSection").then((m) => m.StudioCtaSection)
);

const DominationSection = dynamic(
  () =>
    import("@/components/domination/DominationSection").then(
      (m) => m.DominationSection
    )
);

const PortfolioSection = dynamic(
  () =>
    import("@/components/portfolio/PortfolioSection").then(
      (m) => m.PortfolioSection
    )
);

const StudioFooter = dynamic(
  () => import("@/components/footer/StudioFooter").then((m) => m.StudioFooter)
);

type Props = {
  videos: YouTubeVideo[];
};

export function HomeExperience({ videos }: Props) {
  const [bootCover, setBootCover] = useState(true);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") setBootCover(false);
    } catch {
      setBootCover(false);
    }
  }, []);

  return (
    <>
      {bootCover ? (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9998,
            background: "#030303",
            pointerEvents: "none"
          }}
        />
      ) : null}
      <UltimateStudiosPreloader
        onReady={() => setBootCover(false)}
        onComplete={() => setBootCover(false)}
      />
      <HeroSection />
      <StudioCtaSection />
      <DominationSection />
      <PortfolioSection videos={videos} />
      <StudioFooter />
    </>
  );
}
