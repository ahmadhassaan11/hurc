import { Injectable } from '@nestjs/common';
// CustomerService / OrderService / EntityHydrator are runtime DI tokens.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- NestJS DI requires runtime references
import { CustomerService, EntityHydrator, OrderService, type RequestContext } from '@vendure/core';
import archiver, { type Archiver } from 'archiver';

/**
 * Streams the requesting customer's GDPR export as a ZIP.
 *
 * The archive contains three flat JSON files (well-formed, pretty-printed):
 *   - customer.json   — profile fields (id, identifiers, locale, customFields)
 *   - addresses.json  — shipping/billing addresses
 *   - orders.json     — full order history (lines, totals, payments, shipments)
 *
 * Returns the `Archiver` stream so the controller can pipe it straight to the
 * response — we never buffer the ZIP in memory.
 */
@Injectable()
export class GdprExportService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly orderService: OrderService,
    private readonly entityHydrator: EntityHydrator,
  ) {}

  async streamExport(ctx: RequestContext, customerId: string): Promise<Archiver> {
    const customer = await this.customerService.findOne(ctx, customerId);
    if (!customer) {
      throw new Error(`Customer ${customerId} not found`);
    }
    await this.entityHydrator.hydrate(ctx, customer, {
      relations: ['addresses'],
    });
    const orders = await this.orderService.findByCustomerId(ctx, customerId, {
      take: 10_000,
    });

    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.append(
      JSON.stringify(
        {
          id: customer.id,
          emailAddress: customer.emailAddress,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phoneNumber: customer.phoneNumber,
          title: customer.title,
          customFields: customer.customFields,
          createdAt: customer.createdAt,
          updatedAt: customer.updatedAt,
        },
        null,
        2,
      ),
      { name: 'customer.json' },
    );

    archive.append(JSON.stringify(customer.addresses ?? [], null, 2), {
      name: 'addresses.json',
    });

    archive.append(JSON.stringify(orders.items, null, 2), {
      name: 'orders.json',
    });

    void archive.finalize();
    return archive;
  }
}
