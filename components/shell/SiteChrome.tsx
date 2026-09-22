"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { CookieConsent } from "@/components/consent/CookieConsent";
import { SiteLegalFooter } from "@/components/legal/SiteLegalFooter";
import { SiteNav } from "@/components/nav/SiteNav";

type Props = {
  email: string;
  children: ReactNode;
  speedInsights?: ReactNode;
};

/** Marketing chrome — skipped on /studio so the CMS is full-screen. */
export function SiteChrome({ email, children, speedInsights }: Props) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteNav />
      {children}
      <SiteLegalFooter email={email} />
      <CookieConsent />
      <GoogleAnalytics />
      {speedInsights}
    </>
  );
}
