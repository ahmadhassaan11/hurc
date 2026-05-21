import { type OnApplicationBootstrap } from '@nestjs/common';
// EventBus is read as a runtime value — NestJS reflect-metadata needs the
// class reference at the constructor-parameter seam. ESLint cannot see
// reflect-metadata, so the inline disable below is the documented escape.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- NestJS DI requires runtime EventBus
import { EventBus, Logger, PluginCommonModule, ProductEvent, VendurePlugin } from '@vendure/core';
import { parse } from 'graphql';
import { filter } from 'rxjs';

import { GpsrController } from './gpsr.controller.js';
import { ResponsiblePerson } from './responsible-person.entity.js';
import { GpsrViolationStore } from './violation-store.service.js';

const loggerCtx = 'GpsrPlugin';

const responsiblePersonSchema = parse(`
  type ResponsiblePerson implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    name: String!
    email: String!
    address: String!
  }
`);

/**
 * EU GPSR compliance plugin.
 *
 * Registers four custom fields on Product:
 *   - responsiblePerson:  relation → ResponsiblePerson entity
 *   - manufacturerInfo:   localeText
 *   - warnings:           localeText
 *   - traceabilityCode:   string (unique)
 *
 * Wires a server-side guard via ProductEvent: any product saved with
 * `enabled: true` and missing GPSR data is logged at error level so it
 * surfaces in observability. The hard-block CustomFieldUiInput in the admin
 * UI lands separately (it requires the admin-ui-plugin extension build chain
 * which is out of scope for this PR — see ADR-0002 §2.7).
 */
@VendurePlugin({
  imports: [PluginCommonModule],
  entities: [ResponsiblePerson],
  controllers: [GpsrController],
  providers: [GpsrViolationStore],
  adminApiExtensions: { schema: responsiblePersonSchema },
  shopApiExtensions: { schema: responsiblePersonSchema },
  configuration: (config) => {
    config.customFields.Product.push(
      {
        name: 'responsiblePerson',
        type: 'relation',
        entity: ResponsiblePerson,
        eager: false,
        nullable: true,
        graphQLType: 'ResponsiblePerson',
      },
      { name: 'manufacturerInfo', type: 'localeText', nullable: true },
      { name: 'warnings', type: 'localeText', nullable: true },
      {
        name: 'traceabilityCode',
        type: 'string',
        unique: true,
        nullable: true,
      },
    );
    return config;
  },
  compatibility: '^3.0.0',
})
export class GpsrPlugin implements OnApplicationBootstrap {
  constructor(
    private readonly eventBus: EventBus,
    private readonly violationStore: GpsrViolationStore,
  ) {}

  onApplicationBootstrap(): void {
    this.eventBus
      .ofType(ProductEvent)
      .pipe(filter((event: ProductEvent) => event.type === 'created' || event.type === 'updated'))
      .subscribe((event: ProductEvent) => {
        const { entity } = event;
        const productId = entity.id.toString();
        if (!entity.enabled) {
          this.violationStore.clear(productId);
          return;
        }

        const cf = entity.customFields as
          | {
              responsiblePersonId?: string | number | null;
              manufacturerInfo?: string | null;
              traceabilityCode?: string | null;
            }
          | undefined;

        const missing: string[] = [];
        if (!cf?.responsiblePersonId) missing.push('responsiblePerson');
        if (!cf?.manufacturerInfo) missing.push('manufacturerInfo');
        if (!cf?.traceabilityCode) missing.push('traceabilityCode');

        if (missing.length > 0) {
          Logger.error(
            `GPSR violation: product "${entity.name}" (id=${entity.id}) is enabled but missing: ${missing.join(', ')}`,
            loggerCtx,
          );
          this.violationStore.upsert({
            productId,
            productName: entity.name,
            missingFields: missing,
            detectedAt: new Date().toISOString(),
          });
        } else {
          this.violationStore.clear(productId);
        }
      });
  }
}
