/**
 * AdSense config from env. Never hardcode publisher IDs in components.
 * Set NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
 * and slot IDs from the AdSense dashboard.
 */

export function getAdSenseClientId(): string | null {
  const raw = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  if (!raw) return null;
  if (!/^ca-pub-\d{10,20}$/.test(raw)) return null;
  return raw;
}

/** ads.txt line uses `pub-…` (no `ca-` prefix). */
export function getAdSensePublisherId(): string | null {
  const client = getAdSenseClientId();
  return client ? client.replace(/^ca-/, "") : null;
}

export function getAdSlot(kind: "inline" | "sidebar" | "index"): string | null {
  const map = {
    inline: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE,
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
    index: process.env.NEXT_PUBLIC_ADSENSE_SLOT_INDEX
  } as const;
  const raw = map[kind]?.trim();
  if (!raw || !/^\d{6,20}$/.test(raw)) return null;
  return raw;
}

export function isAdSenseReady(kind?: "inline" | "sidebar" | "index") {
  if (!getAdSenseClientId()) return false;
  if (kind) return Boolean(getAdSlot(kind));
  return true;
}
