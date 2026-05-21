'use server';

import 'server-only';

import {
  CreateCustomerAddressDocument,
  DeleteCustomerAddressDocument,
  LoginDocument,
  LogoutDocument,
  RegisterCustomerAccountDocument,
  RequestPasswordResetDocument,
  ResetPasswordDocument,
  UpdateCustomerAddressDocument,
  UpdateCustomerDocument,
  VerifyCustomerAccountDocument,
} from '@hurc/graphql/shop';
import { revalidateTag } from 'next/cache';
import { z } from 'zod';

import { actionClient } from '@/lib/actions/client';
import { logger } from '@/lib/logger/server';
import { shopMutation } from '@/lib/vendure/client';
import { isVendureErrorCode } from '@/lib/vendure/error-messages';
import { tags } from '@/lib/vendure/revalidation';

type ResultPayload = { __typename?: string; errorCode?: string; message?: string };

function isErrorResult(value: ResultPayload | null | undefined): value is {
  __typename: string;
  errorCode: string;
  message: string;
} {
  return (
    value !== null &&
    value !== undefined &&
    'errorCode' in value &&
    isVendureErrorCode(value.errorCode)
  );
}

function invalidateCustomer(): void {
  revalidateTag(tags.customer('current'));
  revalidateTag(tags.cart('current'));
}

const addressInputSchema = z.object({
  fullName: z.string().min(1).max(120),
  company: z.string().max(120).optional(),
  streetLine1: z.string().min(1).max(255),
  streetLine2: z.string().max(255).optional(),
  city: z.string().min(1).max(120),
  province: z.string().max(120).optional(),
  postalCode: z.string().min(1).max(40),
  countryCode: z.string().min(2).max(8),
  phoneNumber: z.string().max(40).optional(),
  defaultShippingAddress: z.boolean().optional(),
  defaultBillingAddress: z.boolean().optional(),
});

export const loginAction = actionClient
  .metadata({ name: 'account/login' })
  .inputSchema(
    z.object({
      username: z.string().email(),
      password: z.string().min(1),
      rememberMe: z.boolean().optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    try {
      const data = await shopMutation(LoginDocument, parsedInput);
      const result = data.login as ResultPayload;
      if (isErrorResult(result)) {
        return { ok: false as const, error: result.errorCode };
      }
      invalidateCustomer();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'login failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const logoutAction = actionClient
  .metadata({ name: 'account/logout' })
  .inputSchema(z.object({}))
  .action(async () => {
    try {
      await shopMutation(LogoutDocument, {});
      invalidateCustomer();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'logout failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const registerAction = actionClient
  .metadata({ name: 'account/register' })
  .inputSchema(
    z.object({
      emailAddress: z.string().email(),
      firstName: z.string().min(1).max(120),
      lastName: z.string().min(1).max(120),
      password: z.string().min(8).max(128),
      phoneNumber: z.string().max(40).optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    try {
      const data = await shopMutation(RegisterCustomerAccountDocument, {
        input: parsedInput,
      });
      const result = data.registerCustomerAccount as ResultPayload;
      if (isErrorResult(result)) {
        return { ok: false as const, error: result.errorCode };
      }
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'register failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const verifyAccountAction = actionClient
  .metadata({ name: 'account/verify' })
  .inputSchema(
    z.object({
      token: z.string().min(1),
      password: z.string().min(8).max(128).optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    try {
      const data = await shopMutation(VerifyCustomerAccountDocument, parsedInput);
      const result = data.verifyCustomerAccount as ResultPayload;
      if (isErrorResult(result)) {
        return { ok: false as const, error: result.errorCode };
      }
      invalidateCustomer();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'verify failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const requestPasswordResetAction = actionClient
  .metadata({ name: 'account/request-password-reset' })
  .inputSchema(z.object({ emailAddress: z.string().email() }))
  .action(async ({ parsedInput }) => {
    try {
      const data = await shopMutation(RequestPasswordResetDocument, parsedInput);
      const result = data.requestPasswordReset as ResultPayload | null;
      if (isErrorResult(result)) {
        return { ok: false as const, error: result.errorCode };
      }
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'requestPasswordReset failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const resetPasswordAction = actionClient
  .metadata({ name: 'account/reset-password' })
  .inputSchema(
    z.object({
      token: z.string().min(1),
      password: z.string().min(8).max(128),
    }),
  )
  .action(async ({ parsedInput }) => {
    try {
      const data = await shopMutation(ResetPasswordDocument, parsedInput);
      const result = data.resetPassword as ResultPayload;
      if (isErrorResult(result)) {
        return { ok: false as const, error: result.errorCode };
      }
      invalidateCustomer();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'resetPassword failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const updateCustomerAction = actionClient
  .metadata({ name: 'account/update' })
  .inputSchema(
    z.object({
      firstName: z.string().min(1).max(120),
      lastName: z.string().min(1).max(120),
      phoneNumber: z.string().max(40).optional(),
    }),
  )
  .action(async ({ parsedInput }) => {
    try {
      await shopMutation(UpdateCustomerDocument, { input: parsedInput });
      invalidateCustomer();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'updateCustomer failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const createAddressAction = actionClient
  .metadata({ name: 'account/address-create' })
  .inputSchema(addressInputSchema)
  .action(async ({ parsedInput }) => {
    try {
      await shopMutation(CreateCustomerAddressDocument, { input: parsedInput });
      invalidateCustomer();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'createAddress failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const updateAddressAction = actionClient
  .metadata({ name: 'account/address-update' })
  .inputSchema(addressInputSchema.extend({ id: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    try {
      await shopMutation(UpdateCustomerAddressDocument, { input: parsedInput });
      invalidateCustomer();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'updateAddress failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });

export const deleteAddressAction = actionClient
  .metadata({ name: 'account/address-delete' })
  .inputSchema(z.object({ id: z.string().min(1) }))
  .action(async ({ parsedInput }) => {
    try {
      await shopMutation(DeleteCustomerAddressDocument, parsedInput);
      invalidateCustomer();
      return { ok: true as const };
    } catch (err) {
      logger.error({ err }, 'deleteAddress failed');
      return { ok: false as const, error: 'UNKNOWN_ERROR' };
    }
  });
