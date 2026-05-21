import { Injectable } from '@nestjs/common';

export type GpsrViolation = {
  productId: string;
  productName: string;
  missingFields: string[];
  detectedAt: string;
};

/**
 * Process-local cache of products published with missing GPSR data. Lives
 * alongside the existing ProductEvent guard in `gpsr.plugin.ts` — the
 * guard logs at error level for observability; this store keeps the same
 * signal addressable so the admin alert + CI gate can read it.
 *
 * The store is intentionally not persisted: it rebuilds from
 * `ProductEvent` and on a fresh boot it is empty until the next event,
 * which is acceptable because (a) the violation is logged regardless,
 * and (b) the launch-gate CI check (Phase 8.5) re-evaluates over the
 * full product catalog via a one-shot script rather than reading this
 * service.
 */
@Injectable()
export class GpsrViolationStore {
  private readonly violations = new Map<string, GpsrViolation>();

  upsert(violation: GpsrViolation): void {
    this.violations.set(violation.productId, violation);
  }

  clear(productId: string): void {
    this.violations.delete(productId);
  }

  list(): GpsrViolation[] {
    return [...this.violations.values()].sort((a, b) =>
      a.detectedAt > b.detectedAt ? -1 : a.detectedAt < b.detectedAt ? 1 : 0,
    );
  }

  size(): number {
    return this.violations.size;
  }
}
