import { Injectable } from '@nestjs/common';
// Logger is a runtime static class.
import { Logger } from '@vendure/core';

import { env } from '../../env.js';

const loggerCtx = 'SanityRevalidateService';

const MAX_ATTEMPTS = 3;
const BASE_BACKOFF_MS = 200;

export type RevalidateResult =
  | { ok: true; status: number }
  | { ok: false; status: number; reason: string };

@Injectable()
export class SanityRevalidateService {
  /**
   * POSTs tags to the storefront's `/api/revalidate?secret=…` endpoint.
   * Retries on 5xx with exponential backoff (200ms / 400ms / 800ms),
   * up to MAX_ATTEMPTS. 4xx responses are treated as terminal — they
   * indicate a contract or auth bug, not a transient failure.
   */
  async revalidateTags(tags: string[]): Promise<RevalidateResult> {
    if (tags.length === 0) return { ok: true, status: 204 };
    const url = `${env.STOREFRONT_URL.replace(/\/$/, '')}/api/revalidate?secret=${encodeURIComponent(env.NEXT_REVALIDATE_SECRET)}`;

    let lastResult: RevalidateResult = {
      ok: false,
      status: 0,
      reason: 'no-attempt',
    };
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ tags }),
        });
        if (res.ok) {
          return { ok: true, status: res.status };
        }
        if (res.status >= 400 && res.status < 500) {
          // 4xx is terminal — don't burn retries on a contract bug.
          const text = await res.text().catch(() => '');
          return {
            ok: false,
            status: res.status,
            reason: text.slice(0, 200) || `HTTP ${res.status}`,
          };
        }
        lastResult = {
          ok: false,
          status: res.status,
          reason: `HTTP ${res.status}`,
        };
      } catch (err) {
        lastResult = {
          ok: false,
          status: 0,
          reason: err instanceof Error ? err.message : String(err),
        };
      }
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, BASE_BACKOFF_MS * 2 ** (attempt - 1)));
      }
    }
    Logger.error(
      `Revalidate failed after ${MAX_ATTEMPTS} attempts: ${lastResult.reason}`,
      loggerCtx,
    );
    return lastResult;
  }
}
