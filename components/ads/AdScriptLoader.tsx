"use client";

import { useEffect, useState } from "react";
import { CONSENT_CHANGED_EVENT, hasAdsConsent } from "@/lib/consent";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export function AdScriptLoader() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const sync = () => setShouldLoad(hasAdsConsent());
    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    const existing = document.getElementById("adsbygoogle-script");
    if (existing) return;

    const script = document.createElement("script");
    script.id = "adsbygoogle-script";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXX";
    document.head.appendChild(script);

    window.adsbygoogle = window.adsbygoogle || [];
  }, [shouldLoad]);

  return null;
}
