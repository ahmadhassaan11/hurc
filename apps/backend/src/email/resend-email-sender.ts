import type { EmailDetails, EmailSender, EmailTransportOptions } from '@vendure/email-plugin';
import { Resend } from 'resend';

/**
 * EmailSender that delegates to Resend. Failures throw — the EmailPlugin's
 * job runs inside BullMQ, so a thrown error becomes a retried job.
 */
export class ResendEmailSender implements EmailSender {
  private readonly client: Resend;

  constructor(apiKey: string) {
    this.client = new Resend(apiKey);
  }

  async send(email: EmailDetails, _options: EmailTransportOptions): Promise<void> {
    const result = await this.client.emails.send({
      from: email.from,
      to: email.recipient,
      subject: email.subject,
      html: email.body,
      ...(email.cc ? { cc: email.cc } : {}),
      ...(email.bcc ? { bcc: email.bcc } : {}),
      ...(email.replyTo ? { replyTo: email.replyTo } : {}),
    });

    if (result.error) {
      // Resend returns { data, error } — error carries name + message.
      throw new Error(`Resend send failed (${result.error.name}): ${result.error.message}`);
    }
  }
}
