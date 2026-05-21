export function CookiesBody() {
  return (
    <>
      <p>
        This page lists the cookies and similar technologies used on hurc.com. You can change your
        decision at any time via the <em>Manage cookies</em> link in the footer.
      </p>

      <h2>Strictly necessary</h2>
      <p>
        These cookies are required to operate the site and cannot be refused via the cookie banner.
        They run under the legitimate-interest legal basis (Art. 6(1)(f) GDPR) and the PECR
        exemption for strictly necessary cookies.
      </p>
      <ul>
        <li>
          <strong>session</strong> — first-party, HttpOnly, Secure, SameSite=Lax. Maintains your
          shopping session and authentication state. Expires on browser close or after 7 days of
          inactivity.
        </li>
        <li>
          <strong>NEXT_LOCALE</strong> — first-party. Remembers your language choice. Expires after
          12 months.
        </li>
        <li>
          <strong>hurc-consent</strong> — first-party, Secure, SameSite=Lax. Stores your cookie
          choices. Expires after 12 months. Re-prompted when our processor list changes.
        </li>
      </ul>

      <h2>Analytics — privacy-first (no consent required)</h2>
      <ul>
        <li>
          <strong>Plausible</strong> — first-party, no cookies. Aggregates anonymous visitor counts.
          Self-hosted in the EU; no personal data leaves the EU.
        </li>
      </ul>

      <h2>Optional analytics (consent-gated)</h2>
      <ul>
        <li>
          <strong>PostHog</strong> (<code>ph_*</code>) — first-party. Product-analytics events for
          feature usage. EU region. Only loaded after consent.
        </li>
        <li>
          <strong>Sentry</strong> (<code>_sentry_*</code>) — first-party. Captures runtime errors
          for debugging. EU region. Only loaded after consent.
        </li>
      </ul>

      <h2>Marketing (consent-gated)</h2>
      <ul>
        <li>
          <strong>Klaviyo</strong> (<code>__kla_*</code>, <code>_kla_*</code>) — third-party. Email
          marketing and personalised recommendations. United States, Standard Contractual Clauses.
          Only loaded after consent.
        </li>
      </ul>

      <h2>How to manage your choices</h2>
      <ul>
        <li>
          Click <em>Manage cookies</em> in the footer to re-open the consent modal at any time.
        </li>
        <li>
          You can also clear cookies via your browser settings — clearing <code>hurc-consent</code>{' '}
          will re-trigger the banner on your next visit.
        </li>
      </ul>
    </>
  );
}
