"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import {
  CONSENT_CHANGED_EVENT,
  applyConsentMode,
  hasAnalyticsConsent,
  readConsent
} from "@/lib/consent";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

function isValidGaId(id: string) {
  return /^G-[A-Z0-9]+$/i.test(id);
}

export function GoogleAnalytics() {
  const [allowed, setAllowed] = useState(false);
  const ready = isValidGaId(GA_MEASUREMENT_ID);

  useEffect(() => {
    const sync = () => {
      const prefs = readConsent();
      if (prefs) applyConsentMode(prefs);
      setAllowed(hasAnalyticsConsent());
    };
    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!allowed || !ready || typeof window.gtag !== "function") return;
    window.gtag("config", GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      send_page_view: true
    });
  }, [allowed, ready]);

  if (!ready) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true,
            send_page_view: false
          });
        `}
      </Script>
    </>
  );
}
