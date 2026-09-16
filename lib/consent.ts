export const CONSENT_STORAGE_KEY = "cookieConsent";
export const ADS_CONSENT_KEY = "adsConsent";
export const ANALYTICS_CONSENT_KEY = "analyticsConsent";
export const CONSENT_CHANGED_EVENT = "uc:consent-changed";
export const OPEN_CONSENT_EVENT = "uc:open-cookie-preferences";

export type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
  ads: boolean;
  updatedAt: string;
};

export const DEFAULT_CONSENT: ConsentPreferences = {
  necessary: true,
  analytics: false,
  ads: false,
  updatedAt: ""
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function readConsent(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ConsentPreferences>;
      return {
        necessary: true,
        analytics: Boolean(parsed.analytics),
        ads: Boolean(parsed.ads),
        updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : ""
      };
    }

    // Legacy keys from earlier scaffold
    const analytics = localStorage.getItem(ANALYTICS_CONSENT_KEY) === "true";
    const ads = localStorage.getItem(ADS_CONSENT_KEY) === "true";
    if (analytics || ads) {
      return { necessary: true, analytics, ads, updatedAt: "" };
    }
  } catch {
    return null;
  }
  return null;
}

export function hasAnalyticsConsent() {
  return readConsent()?.analytics === true;
}

export function hasAdsConsent() {
  return readConsent()?.ads === true;
}

/** Push Google Consent Mode v2 update (safe if gtag missing). */
export function applyConsentMode(prefs: ConsentPreferences) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  const gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  window.gtag = gtag;

  gtag("consent", "update", {
    ad_storage: prefs.ads ? "granted" : "denied",
    ad_user_data: prefs.ads ? "granted" : "denied",
    ad_personalization: prefs.ads ? "granted" : "denied",
    analytics_storage: prefs.analytics ? "granted" : "denied"
  });
}

export function writeConsent(prefs: Omit<ConsentPreferences, "necessary" | "updatedAt"> & { necessary?: true }) {
  const next: ConsentPreferences = {
    necessary: true,
    analytics: Boolean(prefs.analytics),
    ads: Boolean(prefs.ads),
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
    localStorage.setItem(ANALYTICS_CONSENT_KEY, next.analytics ? "true" : "false");
    localStorage.setItem(ADS_CONSENT_KEY, next.ads ? "true" : "false");
  } catch {
    // Private mode / blocked storage — still apply in-memory signals
  }

  applyConsentMode(next);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT, { detail: next }));
  return next;
}

export function openCookiePreferences() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT));
}
