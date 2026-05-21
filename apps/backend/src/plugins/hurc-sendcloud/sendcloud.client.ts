import { Injectable } from '@nestjs/common';
// Logger is a runtime static class.
import { Logger } from '@vendure/core';

import { env } from '../../env.js';

const loggerCtx = 'SendcloudClient';

/**
 * Sendcloud Shipping Methods API response shape (subset we use). Sendcloud's
 * v2 API returns more fields per method; we only model what the calculator
 * needs.
 *
 * Docs: https://api.sendcloud.dev/docs/sendcloud-public-api/shipping-methods
 */
export type SendcloudCountryRate = {
  iso_2: string;
  iso_3: string;
  /** Net price as a string, e.g. "5.95" — minor units inferred by callers. */
  price: string;
};

export type SendcloudMethod = {
  id: number;
  name: string;
  carrier: string;
  countries: SendcloudCountryRate[];
};

export type SendcloudErrorCode =
  | 'SHIPPING_PROVIDER_DISABLED'
  | 'SHIPPING_PROVIDER_UNAVAILABLE'
  | 'SHIPPING_PROVIDER_4XX';

export type SendcloudError = {
  code: SendcloudErrorCode;
  status: number;
  message: string;
  /** Whether the caller should retry — true only for 5xx / network failures. */
  retriable: boolean;
};

export type SendcloudResult<T> = { ok: true; data: T } | { ok: false; error: SendcloudError };

@Injectable()
export class SendcloudClient {
  private readonly basicAuth: string | null;
  private readonly baseUrl = 'https://panel.sendcloud.sc/api/v2';

  constructor() {
    if (env.shipping.kind === 'enabled') {
      this.basicAuth =
        'Basic ' +
        Buffer.from(`${env.shipping.publicKey}:${env.shipping.secretKey}`).toString('base64');
    } else {
      this.basicAuth = null;
    }
  }

  isEnabled(): boolean {
    return this.basicAuth !== null;
  }

  async listShippingMethods(opts: {
    fromCountry: string;
    toCountry: string;
  }): Promise<SendcloudResult<SendcloudMethod[]>> {
    if (!this.basicAuth) {
      return {
        ok: false,
        error: {
          code: 'SHIPPING_PROVIDER_DISABLED',
          status: 0,
          message: 'Sendcloud credentials are not configured',
          retriable: false,
        },
      };
    }

    const url = new URL(`${this.baseUrl}/shipping_methods`);
    url.searchParams.set('from_country', opts.fromCountry);
    url.searchParams.set('to_country', opts.toCountry);

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: this.basicAuth,
          Accept: 'application/json',
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      Logger.error(`Sendcloud network error: ${message}`, loggerCtx);
      return {
        ok: false,
        error: {
          code: 'SHIPPING_PROVIDER_UNAVAILABLE',
          status: 0,
          message,
          retriable: true,
        },
      };
    }

    if (!response.ok) {
      const text = await response.text().catch(() => '');
      const code: SendcloudErrorCode =
        response.status >= 500 ? 'SHIPPING_PROVIDER_UNAVAILABLE' : 'SHIPPING_PROVIDER_4XX';
      return {
        ok: false,
        error: {
          code,
          status: response.status,
          message: text.slice(0, 200) || `HTTP ${response.status}`,
          retriable: response.status >= 500,
        },
      };
    }

    const json = (await response.json()) as { shipping_methods?: unknown };
    if (!Array.isArray(json.shipping_methods)) {
      return {
        ok: false,
        error: {
          code: 'SHIPPING_PROVIDER_4XX',
          status: response.status,
          message: 'Sendcloud response missing shipping_methods array',
          retriable: false,
        },
      };
    }
    return { ok: true, data: json.shipping_methods as SendcloudMethod[] };
  }
}
