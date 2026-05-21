/**
 * Customer fixture — registers and verifies a one-shot customer against
 * the live Vendure shop-api, returning the authenticated session cookie
 * for the test browser context to adopt.
 *
 * Skipped when the backend is unreachable (see fixtures/backend.ts).
 *
 * Each invocation uses a unique email (timestamped) so re-runs do not
 * collide on the unique-email constraint.
 */
import { randomBytes } from 'node:crypto';

import type { BrowserContext } from '@playwright/test';

const SHOP_API =
  process.env.VENDURE_SHOP_API_URL_INTERNAL ??
  process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL ??
  'http://localhost:3001/shop-api';

const REGISTER_MUTATION = `mutation Register($input: RegisterCustomerInput!) {
  registerCustomerAccount(input: $input) {
    __typename
  }
}`;

const LOGIN_MUTATION = `mutation Login($u: String!, $p: String!) {
  login(username: $u, password: $p, rememberMe: true) {
    __typename
    ... on CurrentUser { id }
  }
}`;

export type SeededCustomer = {
  email: string;
  password: string;
};

export async function seedCustomer(context: BrowserContext): Promise<SeededCustomer> {
  const suffix = randomBytes(4).toString('hex');
  const email = `e2e-${Date.now()}-${suffix}@hurc.test`;
  const password = `Test!${suffix}A1`;

  const reg = await fetch(SHOP_API, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: REGISTER_MUTATION,
      variables: {
        input: { emailAddress: email, password, firstName: 'E2E', lastName: 'Test' },
      },
    }),
  });
  if (!reg.ok) throw new Error(`registerCustomerAccount failed (${reg.status})`);

  const login = await fetch(SHOP_API, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: LOGIN_MUTATION, variables: { u: email, p: password } }),
  });
  const sessionCookie = login.headers.get('set-cookie');
  if (sessionCookie === null) throw new Error('login did not set a session cookie');
  const value = sessionCookie.split(';')[0]?.split('=')[1];
  if (value === undefined) throw new Error('malformed session cookie');
  await context.addCookies([
    {
      name: 'session',
      value,
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);

  return { email, password };
}
