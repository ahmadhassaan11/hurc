import { Injectable } from '@nestjs/common';
// TransactionalConnection / CustomerService / Logger / Address / Customer are
// runtime DI tokens / entity classes.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- NestJS DI + TypeORM repos require runtime references
import {
  Address,
  Customer,
  CustomerService,
  EntityHydrator,
  Logger,
  type RequestContext,
  TransactionalConnection,
} from '@vendure/core';

const loggerCtx = 'GdprDeleteService';

/**
 * Result of a deletion request. PII scrub is best-effort across customer +
 * addresses; if any step fails partway, the function throws and the caller
 * surfaces a 500 — Vendure's request transaction rolls back any half-applied
 * writes.
 */
export type DeletionResult = {
  ok: true;
  customerId: string;
  /** ISO timestamp of the deletion. */
  deletedAt: string;
  /** Original email address — used by the caller to send a confirmation. */
  notificationEmail: string;
};

@Injectable()
export class GdprDeleteService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly entityHydrator: EntityHydrator,
    private readonly connection: TransactionalConnection,
  ) {}

  /**
   * Scrubs PII from the customer + their addresses, then soft-deletes the
   * customer row. Order rows are intentionally retained — German tax law
   * (HGB §257) requires 10-year retention of accounting records, and the
   * scrubbed Customer row keeps the FK target valid.
   */
  async deleteCustomerData(ctx: RequestContext, customerId: string): Promise<DeletionResult> {
    const customer = await this.customerService.findOne(ctx, customerId);
    if (!customer) {
      throw new Error(`Customer ${customerId} not found`);
    }
    await this.entityHydrator.hydrate(ctx, customer, {
      relations: ['addresses'],
    });

    const notificationEmail = customer.emailAddress;
    const placeholderEmail = `deleted-${customer.id}@hurc.invalid`;

    const customerRepo = this.connection.getRepository(ctx, Customer);
    await customerRepo.update(customer.id, {
      emailAddress: placeholderEmail,
      firstName: 'Deleted',
      lastName: 'Customer',
      phoneNumber: '',
      title: '',
    });

    const addressRepo = this.connection.getRepository(ctx, Address);
    for (const address of customer.addresses ?? []) {
      await addressRepo.update(address.id, {
        fullName: 'Deleted Customer',
        company: '',
        streetLine1: '',
        streetLine2: '',
        city: '',
        postalCode: '',
        phoneNumber: '',
      });
    }

    await this.customerService.softDelete(ctx, customer.id);

    Logger.info(
      `GDPR deletion completed for customer ${customer.id} (${customer.addresses?.length ?? 0} addresses scrubbed)`,
      loggerCtx,
    );

    return {
      ok: true,
      customerId: customer.id.toString(),
      deletedAt: new Date().toISOString(),
      notificationEmail,
    };
  }
}
