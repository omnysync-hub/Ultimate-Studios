import { LegalDoc } from "@/components/legal/LegalDoc";
import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/cms/store";

const UPDATED = "September 12, 2026";

export async function generateMetadata() {
  return buildMetadata({
    title: "Privacy Policy",
    description:
      "How Ultimate Cineverse collects and uses data, including contact forms, analytics, cookies, and Google AdSense on blog pages.",
    pathname: "/privacy"
  });
}

export default async function PrivacyPage() {
  const site = await getSite();
  const email = site.contact.email;

  return (
    <LegalDoc title="Privacy Policy" updated={UPDATED}>
      <p>
        This Privacy Policy explains how <strong>{site.brandName}</strong> (“we”, “us”) handles
        information when you visit {site.brandName} online properties (the “Site”), contact us, or
        use related services. It covers analytics, advertising on blog pages, cookies, and your
        privacy rights.
      </p>

      <h2>1. Who we are</h2>
      <p>
        Controller: {site.brandName}. Privacy requests:{" "}
        <a href={`mailto:${email}`}>{email}</a>
        {site.contact.phone ? (
          <>
            {" "}
            · Phone: {site.contact.phone}
          </>
        ) : null}
        .
      </p>
      {site.contact.addressLines.length > 0 ? (
        <p>Postal address: {site.contact.addressLines.join(", ")}.</p>
      ) : null}

      <h2>2. What we collect</h2>
      <h3>Information you provide</h3>
      <ul>
        <li>
          <strong>Contact form</strong> — name, email address, and message content you submit.
        </li>
        <li>
          <strong>Email</strong> — if you write us directly at {email}.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Technical data</strong> — IP address, browser type, device, pages viewed, referring
          URL, approximate location derived from IP, and timestamps.
        </li>
        <li>
          <strong>Cookies &amp; similar technologies</strong> — see our{" "}
          <a href="/cookies">Cookie Policy</a> and the cookie banner on this Site.
        </li>
      </ul>

      <h2>3. How we use information</h2>
      <ul>
        <li>Respond to inquiries and operate the Site.</li>
        <li>Measure traffic and improve performance (Google Analytics 4), when you consent.</li>
        <li>
          Show advertising on <strong>/blog</strong> pages only (Google AdSense), when you consent.
        </li>
        <li>Comply with law, prevent abuse, and secure our systems.</li>
      </ul>
      <p>
        We do not sell your personal information for money. Under some US state laws, “sharing” for
        cross-context behavioral advertising may apply when ads are personalized — you can opt out
        via cookie preferences or the links below.
      </p>

      <h2>4. Cookies &amp; third parties</h2>
      <p>Depending on your choices, we may use:</p>
      <ul>
        <li>
          <strong>Google Analytics 4</strong> — analytics cookies and measurement. Google’s terms
          apply; see{" "}
          <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">
            Google Privacy Policy
          </a>
          .
        </li>
        <li>
          <strong>Google AdSense</strong> — advertising cookies on blog routes only. Ads may be
          personalized or non-personalized based on consent. See{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            rel="noopener noreferrer"
            target="_blank"
          >
            How Google uses information from sites
          </a>
          .
        </li>
        <li>
          <strong>Hosting / performance</strong> — our host (e.g. Vercel) may process technical logs
          and first-party performance metrics needed to deliver the Site.
        </li>
        <li>
          <strong>Sanity</strong> — if you use our content studio, Sanity processes account and
          content data under their terms (editors only).
        </li>
      </ul>
      <p>
        We load analytics and advertising scripts only after consent (where required) and use{" "}
        <strong>Google Consent Mode v2</strong> signals so Google products respect your choices in
        the EEA/UK and similar regions.
      </p>

      <h2>5. Legal bases (GDPR / UK GDPR)</h2>
      <ul>
        <li>
          <strong>Consent</strong> — non-essential cookies, analytics, and advertising.
        </li>
        <li>
          <strong>Legitimate interests</strong> — securing the Site, preventing fraud, basic
          operations.
        </li>
        <li>
          <strong>Contract / steps prior to contract</strong> — responding to booking or production
          inquiries you initiate.
        </li>
        <li>
          <strong>Legal obligation</strong> — when we must retain or disclose information.
        </li>
      </ul>

      <h2>6. Your rights</h2>
      <h3>EEA / UK (GDPR)</h3>
      <p>
        You may request access, correction, deletion, restriction, portability, and object to
        certain processing. Where processing is based on consent, you may withdraw consent at any
        time via <strong>Manage cookies</strong> in the site footer without affecting prior lawful
        processing. You may lodge a complaint with your local supervisory authority.
      </p>
      <h3>California (CCPA / CPRA) and similar US state laws</h3>
      <p>
        California residents may request to know, delete, or correct personal information, and to
        opt out of “sale” or “sharing” for cross-context behavioral advertising. We do not
        knowingly sell personal information of minors under 16. To exercise rights, email{" "}
        <a href={`mailto:${email}?subject=Privacy%20request`}>{email}</a> with “Privacy request” in
        the subject. You will not be discriminated against for exercising these rights.
      </p>
      <p>
        Global Privacy Control (GPC) and similar browser signals: treat a valid opt-out signal as a
        request to disable advertising cookies where technically feasible; also use Manage cookies.
      </p>

      <h2>7. Retention</h2>
      <p>
        Contact messages are kept as long as needed to respond and for ordinary business records
        (typically up to 24 months unless a longer period is required). Analytics and ad data follow
        Google’s retention settings and your consent choices. Consent preferences remain until you
        change them or clear site data.
      </p>

      <h2>8. Security &amp; international transfers</h2>
      <p>
        We use reasonable technical and organizational measures. Providers (Google, hosting, CMS)
        may process data in the United States or other countries. Where required, transfers rely on
        appropriate safeguards (e.g. Standard Contractual Clauses) offered by those providers.
      </p>

      <h2>9. Children</h2>
      <p>
        The Site is not directed to children under 13 (or the age required in your jurisdiction). We
        do not knowingly collect their personal information.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update this policy. The “Last updated” date will change when we do. Continued use of
        the Site after changes means you have seen the updated policy.
      </p>

      <h2>11. Contact</h2>
      <p>
        Privacy questions or requests: <a href={`mailto:${email}`}>{email}</a>. You can also use our{" "}
        <a href="/contact">contact form</a>. Related: <a href="/cookies">Cookie Policy</a>,{" "}
        <a href="/terms">Terms of Service</a>.
      </p>
    </LegalDoc>
  );
}
