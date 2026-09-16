"use client";

import dynamic from "next/dynamic";
import { DeferredSection } from "@/components/common/DeferredSection";
import { StudioCtaSection } from "@/components/cta/StudioCtaSection";
import { HeroSection } from "@/components/hero/HeroSection";
import type { YouTubeVideo } from "@/lib/youtube";

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

type StudioProps = {
  contact: {
    phone: string;
    email: string;
    addressLines: string[];
  };
  socials: Array<{ id: string; label: string; href: string }>;
  footerReelSrc: string;
};

type Props = {
  videos: YouTubeVideo[];
} & StudioProps;

export function HomeExperience({ videos, contact, socials, footerReelSrc }: Props) {
  return (
    <>
      <HeroSection />
      <StudioCtaSection />
      <DeferredSection minHeight="140vh" rootMargin="80% 0px">
        <DominationSection />
      </DeferredSection>
      <PortfolioSection videos={videos} />
      <DeferredSection minHeight="210vh" rootMargin="40% 0px">
        <StudioFooter contact={contact} socials={socials} footerReelSrc={footerReelSrc} />
      </DeferredSection>
    </>
  );
}
