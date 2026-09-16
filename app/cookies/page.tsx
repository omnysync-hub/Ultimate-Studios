import { LegalDoc } from "@/components/legal/LegalDoc";
import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/cms/store";

const UPDATED = "September 12, 2026";

export async function generateMetadata() {
  return buildMetadata({
    title: "Cookie Policy",
    description:
      "How Ultimate Cineverse uses cookies and similar technologies, including analytics and AdSense on blog pages, and how to manage consent.",
    pathname: "/cookies"
  });
}

export default async function CookiesPage() {
  const site = await getSite();
  const email = site.contact.email;

  return (
    <LegalDoc title="Cookie Policy" updated={UPDATED}>
      <p>
        This Cookie Policy explains how <strong>{site.brandName}</strong> uses cookies and similar
        technologies on this Site. It should be read with our{" "}
        <a href="/privacy">Privacy Policy</a>.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device. Similar technologies include local
        storage, pixels, and scripts that store or read identifiers. We use them to run the Site,
        remember your consent choices, measure traffic (if allowed), and show ads on blog pages (if
        allowed).
      </p>

      <h2>2. How we ask for consent</h2>
      <p>
        When you first visit, a cookie banner lets you <strong>Accept all</strong>,{" "}
        <strong>Reject non-essential</strong>, or <strong>Customize</strong>. You can reopen
        preferences anytime via <strong>Manage cookies</strong> in the footer. We set Google Consent
        Mode v2 defaults to denied until you allow analytics and/or advertising.
      </p>

      <h2>3. Categories we use</h2>
      <h3>Necessary</h3>
      <ul>
        <li>
          <strong>Consent storage</strong> (`cookieConsent` and related keys in local storage) —
          remembers your cookie choices.
        </li>
        <li>Security and basic delivery cookies set by our hosting provider as needed.</li>
      </ul>
      <p>These are required for the Site to function as you expect and are always active.</p>

      <h3>Analytics (optional)</h3>
      <ul>
        <li>
          <strong>Google Analytics 4</strong> — helps us understand visits, popular pages, and
          technical performance. Loads only when analytics consent is granted.
        </li>
      </ul>

      <h3>Advertising (optional, blog only)</h3>
      <ul>
        <li>
          <strong>Google AdSense</strong> — serves ads on <code>/blog</code> routes only. May use
          cookies for frequency capping and, if you allow personalized ads, relevance. Script and ad
          units initialize only when advertising consent is granted.
        </li>
      </ul>

      <h2>4. Duration</h2>
      <p>
        Consent preferences persist until you change them or clear site data. Google analytics and
        advertising cookies follow Google’s documented lifetimes (session to multi-month depending
        on cookie type).
      </p>

      <h2>5. Managing cookies</h2>
      <ul>
        <li>Use <strong>Manage cookies</strong> in the site footer.</li>
        <li>Browser settings can block or delete cookies (may affect Site features).</li>
        <li>
          Google ad settings:{" "}
          <a href="https://adssettings.google.com/" rel="noopener noreferrer" target="_blank">
            adssettings.google.com
          </a>
          .
        </li>
        <li>
          Industry opt-outs (where available):{" "}
          <a href="https://optout.aboutads.info/" rel="noopener noreferrer" target="_blank">
            aboutads.info
          </a>
          .
        </li>
      </ul>

      <h2>6. Contact</h2>
      <p>
        Cookie questions: <a href={`mailto:${email}`}>{email}</a>. More detail on data rights is in
        the <a href="/privacy">Privacy Policy</a>.
      </p>
    </LegalDoc>
  );
}
