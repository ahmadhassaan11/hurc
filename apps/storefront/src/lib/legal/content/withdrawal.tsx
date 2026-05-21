import { loadCompany } from '../company';

export function WithdrawalBody() {
  const company = loadCompany();
  return (
    <>
      <p>
        You have the right to withdraw from this contract within 14 days without giving any reason.
        The withdrawal period expires 14 days after the day you (or a third party other than the
        carrier indicated by you) acquire physical possession of the goods.
      </p>

      <h2>How to withdraw</h2>
      <p>
        To exercise the right of withdrawal, you must inform us — {company.name}, {company.address},
        email{' '}
        <a href={`mailto:${company.email}`} rel="noopener">
          {company.email}
        </a>{' '}
        — of your decision by an unequivocal statement (e.g. a letter sent by post or email). You
        may use the model withdrawal form below, but it is not obligatory.
      </p>
      <p>
        To meet the withdrawal deadline, it is sufficient for you to send your communication
        concerning your exercise of the right of withdrawal before the withdrawal period has
        expired.
      </p>

      <h2>Effects of withdrawal</h2>
      <p>
        If you withdraw from this contract, we will reimburse all payments received from you,
        including the costs of delivery (with the exception of any supplementary costs resulting
        from your choice of a type of delivery other than the least expensive type of standard
        delivery offered by us), without undue delay and in any event not later than 14 days from
        the day on which we are informed about your decision to withdraw.
      </p>
      <p>
        We will carry out the reimbursement using the same means of payment as you used for the
        initial transaction, unless you have expressly agreed otherwise. In any event, you will not
        incur any fees as a result of the reimbursement. We may withhold reimbursement until we have
        received the goods back or you have supplied evidence of having sent back the goods,
        whichever is the earliest.
      </p>
      <p>
        You shall send back the goods or hand them over to us, without undue delay and in any event
        not later than 14 days from the day on which you communicate your withdrawal from this
        contract to us. The deadline is met if you send back the goods before the period of 14 days
        has expired. You will have to bear the direct cost of returning the goods unless we have
        agreed otherwise. You are only liable for any diminished value of the goods resulting from
        the handling other than what is necessary to establish the nature, characteristics and
        functioning of the goods.
      </p>

      <h2>Model withdrawal form</h2>
      <p>(Complete and return this form only if you wish to withdraw from the contract.)</p>
      <ul>
        <li>
          To {company.name}, {company.address},{' '}
          <a href={`mailto:${company.email}`} rel="noopener">
            {company.email}
          </a>
          :
        </li>
        <li>
          I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract of sale of the
          following goods (*)/for the provision of the following service (*),
        </li>
        <li>Ordered on (*)/received on (*),</li>
        <li>Name of consumer(s),</li>
        <li>Address of consumer(s),</li>
        <li>Signature of consumer(s) (only if this form is notified on paper),</li>
        <li>Date.</li>
      </ul>
      <p>(*) Delete as appropriate.</p>
    </>
  );
}
