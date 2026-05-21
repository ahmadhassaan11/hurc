import { type DeepPartial, VendureEntity } from '@vendure/core';
import { Column, Entity, Index } from 'typeorm';

export type NewsletterStatus = 'pending' | 'verified' | 'unsubscribed';

/**
 * Authoritative store for newsletter subscriptions. We don't treat Resend
 * Audiences as the source of truth — they're a sync target for verified
 * contacts only (sync wired in a follow-up). Pending and unsubscribed rows
 * live here so we own the double-opt-in lifecycle.
 */
@Entity()
export class NewsletterSubscription extends VendureEntity {
  constructor(input?: DeepPartial<NewsletterSubscription>) {
    super(input);
  }

  // tsx (esbuild backend) does not emit `design:type` decorator metadata,
  // so column types must be specified explicitly. See the matching note on
  // ResponsiblePerson.
  @Index({ unique: true })
  @Column({ type: 'varchar' })
  email!: string;

  /** ISO 639-1 locale (e.g. 'en', 'de') used to render the confirm email. */
  @Column({ type: 'varchar', default: 'en' })
  locale!: string;

  @Column({ type: 'varchar', length: 16 })
  status!: NewsletterStatus;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt!: Date | null;
}
