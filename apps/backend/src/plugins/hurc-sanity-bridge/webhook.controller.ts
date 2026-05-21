import { Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
// Allow / Permission are runtime decorator factories / enum values.
import { Allow, Permission } from '@vendure/core';
import type { Request, Response } from 'express';

import { env } from '../../env.js';
import { payloadToTags, type SanityPayload } from './payload-mapper.js';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- NestJS DI requires runtime services
import { SanityRevalidateService } from './revalidate.service.js';
import { verifySanitySignature } from './signature.js';

/**
 * `POST /webhooks/sanity` — public endpoint; the HMAC signature *is* the auth.
 *
 * Relies on the SanityBridgePlugin's `express.raw()` middleware running first
 * for this route, so `req.body` is the raw `Buffer` of the request payload.
 * Re-stringifying the parsed body would change byte-for-byte content and
 * break the HMAC.
 */
@Controller('webhooks/sanity')
export class SanityWebhookController {
  constructor(private readonly revalidate: SanityRevalidateService) {}

  @Post()
  @Allow(Permission.Public)
  @HttpCode(HttpStatus.OK)
  async receive(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ ok: boolean; tags?: string[]; error?: string }> {
    const rawBody = req.body;
    if (!Buffer.isBuffer(rawBody)) {
      // The middleware didn't run — fail loudly, don't trust whatever
      // pre-parsed shape made it here.
      res.status(HttpStatus.INTERNAL_SERVER_ERROR);
      return { ok: false, error: 'raw-body-middleware-not-active' };
    }

    const headerValue = req.header('sanity-webhook-signature');
    const verification = verifySanitySignature(headerValue, rawBody, env.SANITY_WEBHOOK_SECRET);
    if (!verification.ok) {
      res.status(HttpStatus.UNAUTHORIZED);
      return { ok: false, error: verification.reason };
    }

    let payload: SanityPayload;
    try {
      payload = JSON.parse(rawBody.toString('utf8')) as SanityPayload;
    } catch {
      res.status(HttpStatus.BAD_REQUEST);
      return { ok: false, error: 'invalid-json' };
    }

    const tags = payloadToTags(payload);
    const result = await this.revalidate.revalidateTags(tags);
    if (!result.ok) {
      res.status(HttpStatus.BAD_GATEWAY);
      return { ok: false, error: result.reason };
    }
    return { ok: true, tags };
  }
}
