"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { StudioCtaSection } from "@/components/cta/StudioCtaSection";
import { DominationSection } from "@/components/domination/DominationSection";
import { StudioFooter } from "@/components/footer/StudioFooter";
import { HeroSection } from "@/components/hero/HeroSection";
import { PortfolioSection } from "@/components/portfolio/PortfolioSection";
import type { YouTubeVideo } from "@/lib/youtube";

const SESSION_KEY = "us-architectural-preloader-v2";

const UltimateStudiosPreloader = dynamic(
  () =>
    import("@/components/preloader/UltimateStudiosPreloader").then(
      (m) => m.UltimateStudiosPreloader
    ),
  { ssr: false }
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
