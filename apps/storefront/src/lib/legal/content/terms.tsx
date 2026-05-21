import { loadCompany } from '../company';

export function TermsBody() {
  const company = loadCompany();
  return (
    <>
      <p>
        These general terms and conditions (&ldquo;GTC&rdquo;) govern the contract between you (the
        customer) and {company.name} (&ldquo;HURC&rdquo;, &ldquo;we&rdquo;) when you place an order
        via{' '}
        <a href="https://hurc.com" rel="noopener noreferrer">
          hurc.com
        </a>
        . By placing an order you accept these GTC.
      </p>

      <h2>1. Contracting party</h2>
      <p>
        {company.name}
        <br />
        {company.address}
        <br />
        {company.registry} · VAT ID {company.vat}
      </p>

      <h2>2. Conclusion of contract</h2>
      <p>
        Product listings on hurc.com are an invitation to treat, not a binding offer. Submitting an
        order via the checkout is a binding offer to purchase. The contract is concluded when we
        send the order-confirmation email — for prepayment methods, on receipt of payment.
      </p>

      <h2>3. Prices and payment</h2>
      <p>
        Prices are in EUR or GBP and include statutory VAT applicable in the destination country.
        Shipping costs are shown at checkout before order submission. Payment is processed via
        Mollie (iDEAL, Bancontact, Klarna, SEPA) or Stripe (cards) — terms of those providers apply.
      </p>

      <h2>4. Delivery</h2>
      <p>
        Delivery within the EU is handled by Sendcloud-affiliated carriers. Estimated delivery times
        are shown at checkout. We are not liable for delays caused by force majeure.
      </p>

      <h2>5. Right of withdrawal</h2>
      <p>
        You have the right to withdraw from this contract within 14 days without giving any reason.
        The withdrawal period expires 14 days after the day you (or a third party designated by you,
        other than the carrier) take physical possession of the goods. To exercise the right of
        withdrawal, see <a href="/legal/withdrawal">our withdrawal page</a>.
      </p>

      <h2>6. Returns and refunds</h2>
      <p>
        We will reimburse you no later than 14 days from the day on which we are informed about your
        decision to withdraw, using the same means of payment as you used for the initial
        transaction. We may withhold reimbursement until we have received the goods back.
      </p>

      <h2>7. Warranty</h2>
      <p>
        Statutory warranty rights under §§ 434 ff. BGB apply. The warranty period is 24 months for
        consumers from delivery.
      </p>

      <h2>8. Liability</h2>
      <p>
        We are liable without limitation for damages caused intentionally or by gross negligence,
        and for damages arising from injury to life, body or health. For ordinary negligence we are
        liable only for breach of essential contractual obligations, limited to foreseeable damages
        typical for this type of contract.
      </p>

      <h2>9. Applicable law and jurisdiction</h2>
      <p>
        German law applies, excluding the UN Convention on the International Sale of Goods. For
        consumers, the mandatory consumer-protection provisions of the country of habitual residence
        remain unaffected.
      </p>

      <h2>10. Severability</h2>
      <p>
        If any provision of these GTC is or becomes invalid, the validity of the remaining
        provisions remains unaffected. The invalid provision is replaced by the statutory provision.
      </p>
    </>
  );
}
