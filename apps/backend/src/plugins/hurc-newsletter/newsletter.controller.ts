import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
// Allow / Ctx / Permission are runtime decorator factories / enum values.
import { Allow, Ctx, Permission, type RequestContext } from '@vendure/core';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- NestJS DI requires runtime services
import { NewsletterService } from './newsletter.service.js';

type SubscribeBody = { email?: unknown; locale?: unknown };
type ConfirmBody = { token?: unknown };
type UnsubscribeBody = { email?: unknown };

function asString(v: unknown, field: string): string {
  if (typeof v !== 'string' || v.length === 0) {
    throw new BadRequestException(`Field "${field}" must be a non-empty string`);
  }
  return v;
}

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly service: NewsletterService) {}

  @Post('subscribe')
  @Allow(Permission.Public)
  async subscribe(
    @Ctx() ctx: RequestContext,
    @Body() body: SubscribeBody,
  ): Promise<{ ok: boolean; status?: string; error?: string }> {
    const email = asString(body.email, 'email');
    const locale = typeof body.locale === 'string' ? body.locale : 'en';
    const result = await this.service.subscribe(ctx, email, locale);
    return result.ok ? { ok: true, status: result.status } : { ok: false, error: result.error };
  }

  @Post('confirm')
  @Allow(Permission.Public)
  async confirm(
    @Ctx() ctx: RequestContext,
    @Body() body: ConfirmBody,
  ): Promise<{ ok: boolean; email?: string; error?: string }> {
    const token = asString(body.token, 'token');
    const result = await this.service.confirm(ctx, token);
    return result.ok ? { ok: true, email: result.email } : { ok: false, error: result.error };
  }

  @Post('unsubscribe')
  @Allow(Permission.Public)
  async unsubscribe(
    @Ctx() ctx: RequestContext,
    @Body() body: UnsubscribeBody,
  ): Promise<{ ok: true; removedCount: number }> {
    const email = asString(body.email, 'email');
    return this.service.unsubscribe(ctx, email);
  }
}
