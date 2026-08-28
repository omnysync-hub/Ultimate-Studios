"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useState } from "react";
import { DeferredSection } from "@/components/common/DeferredSection";
import { StudioCtaSection } from "@/components/cta/StudioCtaSection";
import { HeroSection } from "@/components/hero/HeroSection";
import type { YouTubeVideo } from "@/lib/youtube";

const UltimateStudiosPreloader = dynamic(
  () =>
    import("@/components/preloader/UltimateStudiosPreloader").then(
      (m) => m.UltimateStudiosPreloader
    ),
  { ssr: false }
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
  () => import("@/components/footer/StudioFooter").then((m) => m.StudioFooter),
  { ssr: false }
);

type Props = {
  videos: YouTubeVideo[];
};

export function HomeExperience({ videos }: Props) {
  const [preloaderNeeded, setPreloaderNeeded] = useState(false);

  useLayoutEffect(() => {
    setPreloaderNeeded(document.documentElement.dataset.preloader === "needed");
  }, []);

  return (
    <>
      {preloaderNeeded ? (
        <UltimateStudiosPreloader
          onReady={() => {
            document.documentElement.classList.add("us-boot-ready");
          }}
          onComplete={() => {
            document.documentElement.classList.add("us-preloader-seen");
            document.documentElement.classList.remove("us-boot-ready");
          }}
        />
      ) : null}
      <HeroSection />
      <StudioCtaSection />
      <DeferredSection minHeight="140vh" rootMargin="80% 0px">
        <DominationSection />
      </DeferredSection>
      <PortfolioSection videos={videos} />
      <DeferredSection minHeight="100vh" rootMargin="40% 0px">
        <StudioFooter />
      </DeferredSection>
    </>
  );
}
