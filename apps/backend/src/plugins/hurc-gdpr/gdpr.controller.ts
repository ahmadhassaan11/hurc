import { Controller, ForbiddenException, Post, Res } from '@nestjs/common';
// Allow / Ctx / CustomerService / Permission are runtime decorator factories /
// DI tokens / enum values.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- decorators + DI require runtime references
import { Allow, Ctx, CustomerService, Permission, type RequestContext } from '@vendure/core';
import type { Response } from 'express';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- NestJS DI requires runtime services
import { type DeletionResult, GdprDeleteService } from './delete.service.js';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- NestJS DI requires runtime services
import { GdprExportService } from './export.service.js';

@Controller('gdpr')
export class GdprController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly exportService: GdprExportService,
    private readonly deleteService: GdprDeleteService,
  ) {}

  @Post('export')
  @Allow(Permission.Authenticated)
  async exportData(@Ctx() ctx: RequestContext, @Res() res: Response): Promise<void> {
    const customerId = await this.resolveOwnCustomerId(ctx);
    const archive = await this.exportService.streamExport(ctx, customerId);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="hurc-data-${customerId}.zip"`);
    archive.pipe(res);
  }

  @Post('delete')
  @Allow(Permission.Authenticated)
  async deleteData(@Ctx() ctx: RequestContext): Promise<DeletionResult> {
    const customerId = await this.resolveOwnCustomerId(ctx);
    return this.deleteService.deleteCustomerData(ctx, customerId);
  }

  /**
   * Always resolves the customer from the active session, never from a
   * request parameter. This is what makes the IDOR test pass — there's no
   * `customerId` in the route, so a customer cannot reach for another
   * customer's data.
   */
  private async resolveOwnCustomerId(ctx: RequestContext): Promise<string> {
    if (ctx.activeUserId === undefined || ctx.activeUserId === null) {
      throw new ForbiddenException('Authentication required');
    }
    const customer = await this.customerService.findOneByUserId(ctx, ctx.activeUserId);
    if (!customer) {
      // Authenticated as an Administrator (no Customer row) — this endpoint is
      // customer-self-service only.
      throw new ForbiddenException(
        'GDPR self-service is only available to authenticated customers',
      );
    }
    return customer.id.toString();
  }
}
