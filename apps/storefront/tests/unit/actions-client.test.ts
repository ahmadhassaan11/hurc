import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

const VALID_ENV = {
  NODE_ENV: 'test',
  APP_ENV: 'dev',
  NEXT_PUBLIC_VENDURE_SHOP_API_URL: 'http://localhost:3001/shop-api',
  VENDURE_SHOP_API_URL_INTERNAL: 'http://localhost:3001/shop-api',
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
  NEXT_PUBLIC_PLAUSIBLE_DOMAIN: 'hurc.local',
  NEXT_PUBLIC_POSTHOG_KEY: 'phc_dummy',
  NEXT_PUBLIC_POSTHOG_HOST: 'https://eu.posthog.com',
};
const ORIGINAL = { ...process.env };

vi.mock('server-only', () => ({}));

beforeAll(() => {
  Object.assign(process.env, VALID_ENV);
});

afterAll(() => {
  for (const k of Object.keys(VALID_ENV)) delete process.env[k];
  Object.assign(process.env, ORIGINAL);
});

describe('actionClient', () => {
  it('runs an action through the safe-action pipeline', async () => {
    const { actionClient } = await import('../../src/lib/actions/client');
    const action = actionClient
      .metadata({ name: 'test/echo' })
      .inputSchema(z.object({ value: z.string().min(1) }))
      .action(async ({ parsedInput, ctx }) => ({
        echoed: parsedInput.value,
        actionName: ctx.actionName,
      }));

    const result = await action({ value: 'hello' });
    expect(result?.data).toEqual({ echoed: 'hello', actionName: 'test/echo' });
  });

  it('rejects malformed input via Zod and surfaces validation errors', async () => {
    const { actionClient } = await import('../../src/lib/actions/client');
    const action = actionClient
      .metadata({ name: 'test/strict' })
      .inputSchema(z.object({ value: z.string().min(3) }))
      .action(async ({ parsedInput }) => ({ value: parsedInput.value }));

    const result = await action({ value: '' });
    expect(result?.validationErrors).toBeDefined();
  });
});
