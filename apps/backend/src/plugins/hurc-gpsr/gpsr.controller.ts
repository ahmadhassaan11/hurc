import { Controller, Get } from '@nestjs/common';
// Allow / Permission are runtime decorator factories.
import { Allow, Permission } from '@vendure/core';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- NestJS DI requires runtime services
import { type GpsrViolation, GpsrViolationStore } from './violation-store.service.js';

@Controller('gpsr')
export class GpsrController {
  constructor(private readonly store: GpsrViolationStore) {}

  /**
   * Lists products currently flagged by the ProductEvent guard for missing
   * GPSR data. Admin-only — exposes product names. Used by the admin UI
   * banner (deferred) and by the CI launch-gate check.
   */
  @Get('violations')
  @Allow(Permission.SuperAdmin)
  list(): { violations: GpsrViolation[]; count: number } {
    const violations = this.store.list();
    return { violations, count: violations.length };
  }
}
