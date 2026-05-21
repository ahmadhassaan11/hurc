import { PluginCommonModule, VendurePlugin } from '@vendure/core';

import { GdprDeleteService } from './delete.service.js';
import { GdprExportService } from './export.service.js';
import { GdprController } from './gdpr.controller.js';

/**
 * GDPR self-service plugin.
 *
 * Exposes `POST /gdpr/export` (returns a ZIP of the active customer's data)
 * and `POST /gdpr/delete` (PII scrub + soft-delete; orders retained for the
 * 10-year German tax-record window). Both endpoints derive the operating
 * customer from the active session — never from a request parameter — so a
 * customer cannot operate on another customer's data.
 */
@VendurePlugin({
  imports: [PluginCommonModule],
  providers: [GdprExportService, GdprDeleteService],
  controllers: [GdprController],
  compatibility: '^3.0.0',
})
export class GdprPlugin {}
