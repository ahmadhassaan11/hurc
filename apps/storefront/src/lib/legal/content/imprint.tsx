import { loadCompany } from '../company';

export function ImprintBody() {
  const company = loadCompany();

  return (
    <>
      <p>
        Information pursuant to § 5 TMG (German Telemedia Act) and § 18 MStV (German Interstate
        Media Treaty).
      </p>

      <h2>Operator</h2>
      <p>
        {company.name}
        <br />
        {company.address}
      </p>

      <h2>Contact</h2>
      <p>
        Email:{' '}
        <a href={`mailto:${company.email}`} rel="noopener">
          {company.email}
        </a>
        <br />
        Phone: {company.phone}
      </p>

      <h2>Commercial register</h2>
      <p>{company.registry}</p>

      <h2>VAT identification</h2>
      <p>VAT ID pursuant to § 27a UStG: {company.vat}</p>

      <h2>Managing directors</h2>
      <p>{company.directors}</p>

      <h2>Responsible for content</h2>
      <p>{`${company.directors}, ${company.address}`}</p>

      <h2>Online dispute resolution</h2>
      <p>
        The European Commission provides a platform for online dispute resolution at{' '}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          ec.europa.eu/consumers/odr
        </a>
        . We are not obliged and not willing to participate in dispute resolution proceedings before
        a consumer arbitration board.
      </p>

      <h2>Disclaimer</h2>
      <p>
        Despite careful content control, we assume no liability for the content of external links.
        The operators of linked pages are solely responsible for their content.
      </p>
    </>
  );
}
