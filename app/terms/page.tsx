import { LegalDoc } from "@/components/legal/LegalDoc";
import { buildMetadata } from "@/lib/seo";
import { getSite } from "@/lib/cms/store";

const UPDATED = "September 12, 2026";

export async function generateMetadata() {
  return buildMetadata({
    title: "Terms of Service",
    description:
      "Terms of Service for Ultimate Cineverse website use, content, inquiries, and limitations of liability.",
    pathname: "/terms"
  });
}

export default async function TermsPage() {
  const site = await getSite();
  const email = site.contact.email;

  return (
    <LegalDoc title="Terms of Service" updated={UPDATED}>
      <p>
        These Terms of Service (“Terms”) govern your access to and use of the {site.brandName}{" "}
        website and related online materials (the “Site”). By using the Site, you agree to these
        Terms. If you do not agree, do not use the Site.
      </p>

      <h2>1. Who we are</h2>
      <p>
        The Site is operated by {site.brandName}. Questions:{" "}
        <a href={`mailto:${email}`}>{email}</a>.
      </p>

      <h2>2. The Site is informational</h2>
      <p>
        Content on the Site—including portfolio examples, blog articles, facility descriptions, and
        marketing copy—is for general information and presentation. It does not create a booking,
        production agreement, or partnership unless we confirm one in a separate written contract.
      </p>

      <h2>3. Inquiries &amp; contact form</h2>
      <p>
        Submitting the contact form or emailing us is an inquiry only. We may respond at our
        discretion. Do not send confidential scripts, passwords, or sensitive personal data through
        the form unless we have asked you to and you understand email is not fully secure.
      </p>

      <h2>4. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the Site in any unlawful way or to harm others.</li>
        <li>Attempt to probe, scrape abusively, disrupt, or reverse engineer the Site.</li>
        <li>Submit spam, malware, or misleading content through forms.</li>
        <li>Impersonate {site.brandName} or misuse our brand, logos, or marks.</li>
      </ul>

      <h2>5. Intellectual property</h2>
      <p>
        Site design, text, graphics, logos, and original content are owned by {site.brandName} or
        our licensors. You may view and share links for personal, non-commercial use. You may not
        copy, redistribute, or commercially exploit Site content without prior written permission,
        except as allowed by law (e.g. fair use).
      </p>
      <p>
        Third-party trademarks (including social platforms and Google) remain the property of their
        owners. Portfolio and video embeds may be subject to YouTube or other platform terms.
      </p>

      <h2>6. Blog content &amp; advertising</h2>
      <p>
        Blog posts are opinion/educational content and may contain errors or become outdated. On
        blog pages only, we may display third-party advertising (Google AdSense) subject to your
        cookie preferences and our <a href="/privacy">Privacy Policy</a> and{" "}
        <a href="/cookies">Cookie Policy</a>. We are not responsible for advertiser content or
        destinations.
      </p>

      <h2>7. Third-party links &amp; embeds</h2>
      <p>
        The Site may link to or embed YouTube, social networks, Google services, or other third
        parties. Their terms and privacy practices apply. We do not control those services.
      </p>

      <h2>8. Disclaimer</h2>
      <p>
        THE SITE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        We do not warrant uninterrupted or error-free operation.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, {site.brandName.toUpperCase()} AND ITS TEAM SHALL
        NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY
        LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SITE. OUR TOTAL LIABILITY
        FOR CLAIMS RELATING TO THE SITE SHALL NOT EXCEED ONE HUNDRED U.S. DOLLARS (US $100) OR THE
        AMOUNT YOU PAID US SPECIFICALLY FOR SITE ACCESS IN THE PRIOR TWELVE MONTHS (IF ANY),
        WHICHEVER IS GREATER.
      </p>

      <h2>10. Indemnity</h2>
      <p>
        You agree to defend and indemnify {site.brandName} against claims arising from your misuse
        of the Site or violation of these Terms, to the extent permitted by law.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These Terms are governed by the laws of the State of California, USA, excluding conflict of
        law rules, unless mandatory consumer protections in your country require otherwise. Courts
        in Los Angeles County, California shall have exclusive jurisdiction for disputes arising
        from these Terms, subject to those mandatory protections.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these Terms. The “Last updated” date will change when we do. Continued use
        after changes constitutes acceptance of the revised Terms.
      </p>

      <h2>13. Contact</h2>
      <p>
        Questions about these Terms: <a href={`mailto:${email}`}>{email}</a> or{" "}
        <a href="/contact">contact form</a>.
      </p>
    </LegalDoc>
  );
}
