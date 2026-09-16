/**
 * Google Consent Mode v2 defaults — must run before gtag/ads scripts.
 * Defaults deny storage until the user accepts via the cookie banner.
 */
export function ConsentDefaults() {
  const code = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
`.trim();

  return (
    <script
      id="google-consent-defaults"
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
