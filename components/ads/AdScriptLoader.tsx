"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const CONSENT_KEY = "adsConsent";

function hasAdsConsent() {
  if (typeof document === "undefined") return false;
  try {
    return localStorage.getItem(CONSENT_KEY) === "true";
  } catch {
    return false;
  }
}

export function AdScriptLoader() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    setShouldLoad(hasAdsConsent());
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    const existing = document.getElementById("adsbygoogle-script");
    if (existing) return;

    const script = document.createElement("script");
    script.id = "adsbygoogle-script";
    script.async = true;
    script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXX";
    document.head.appendChild(script);

    // Ensure adsbygoogle array exists before first ad.
    window.adsbygoogle = window.adsbygoogle || [];
  }, [shouldLoad]);

  return null;
}

