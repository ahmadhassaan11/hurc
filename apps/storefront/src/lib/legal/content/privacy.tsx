import { loadCompany } from '../company';

export function PrivacyBody() {
  const company = loadCompany();
  return (
    <>
      <p>
        This privacy notice describes how {company.name} (&ldquo;HURC&rdquo;, &ldquo;we&rdquo;)
        processes personal data under the EU General Data Protection Regulation (GDPR) when you
        visit{' '}
        <a href="https://hurc.com" rel="noopener noreferrer">
          hurc.com
        </a>{' '}
        and place orders.
      </p>

      <h2>Controller</h2>
      <p>
        {company.name}
        <br />
        {company.address}
        <br />
        Email:{' '}
        <a href={`mailto:${company.email}`} rel="noopener">
          {company.email}
        </a>
      </p>

      <h2>Categories of data we process</h2>
      <ul>
        <li>
          <strong>Account data.</strong> Email, name, password hash, addresses, phone (when given).
          Legal basis: Art. 6(1)(b) GDPR (contract performance).
        </li>
        <li>
          <strong>Order data.</strong> Items, prices, payments, shipments, returns. Retained for the
          statutory periods (HGB §257, AO §147 — 6–10 years).
        </li>
        <li>
          <strong>Browsing data.</strong> Aggregated, cookieless visit counts via Plausible
          (legitimate interest, Art. 6(1)(f) GDPR; necessary cookies, PECR Reg. 6(4)(b)).
        </li>
        <li>
          <strong>Optional analytics.</strong> Product analytics (PostHog, EU region) and error
          monitoring (Sentry, EU region) only after explicit consent (Art. 6(1)(a) GDPR). You can
          withdraw consent at any time via <em>Manage cookies</em> in the footer.
        </li>
        <li>
          <strong>Marketing.</strong> Newsletter and personalised recommendations via Klaviyo
          (United States, Standard Contractual Clauses) only after explicit consent.
        </li>
      </ul>

      <h2>Recipients</h2>
      <p>We use the following processors, each bound by a data-processing agreement:</p>
      <ul>
        <li>Hetzner (DE) — application hosting.</li>
        <li>Vercel (EU region) — storefront edge delivery.</li>
        <li>Cloudflare (EU) — DNS, WAF, CDN.</li>
        <li>Mollie (NL) and Stripe (IE) — payment processing.</li>
        <li>Sendcloud (NL) — shipping label generation.</li>
        <li>Resend (EU region) — transactional email.</li>
        <li>Sanity (EU region) — editorial content.</li>
        <li>Plausible (DE) — privacy-first analytics, no cookies, no PII.</li>
        <li>PostHog (EU region) — product analytics, only with consent.</li>
        <li>Sentry (EU region) — error monitoring, only with consent.</li>
        <li>Klaviyo (US, SCCs) — marketing email, only with consent.</li>
      </ul>

      <h2>Your rights</h2>
      <p>
        Under GDPR you have the right to access (Art. 15), rectification (Art. 16), erasure (Art.
        17), restriction (Art. 18), data portability (Art. 20) and objection (Art. 21). You can
        exercise access and erasure via <a href="/account/data">your account</a> — we generate a ZIP
        export and erase identifying fields on request, retaining only what statutory law requires
        for the legal retention period.
      </p>
      <p>
        You also have the right to lodge a complaint with a supervisory authority. The competent
        authority is the Berlin Commissioner for Data Protection and Freedom of Information,{' '}
        <a href="https://www.datenschutz-berlin.de" target="_blank" rel="noopener noreferrer">
          datenschutz-berlin.de
        </a>
        .
      </p>

      <h2>Retention</h2>
      <p>
        Order data: 10 years (statutory). Account data: until you delete your account or 3 years of
        inactivity, whichever is sooner. Marketing: until you unsubscribe. Analytics: 25 months
        (PostHog default, EU).
      </p>

      <h2>International transfers</h2>
      <p>
        We process your data primarily in the EU/EEA. Where transfers occur (currently: Klaviyo in
        the US), we rely on Standard Contractual Clauses pursuant to Art. 46(2)(c) GDPR.
      </p>

      <h2>Cookies</h2>
      <p>
        See our <a href="/legal/cookies">cookie policy</a> for the full list of cookies and similar
        technologies. You can manage your choices via the <em>Manage cookies</em> link in the
        footer.
      </p>

      <h2>Updates</h2>
      <p>
        Material changes to this notice trigger a re-prompt of your consent on next visit. The
        version date is shown above. Last reviewed: 2026-05-03.
      </p>
    </>
  );
}
