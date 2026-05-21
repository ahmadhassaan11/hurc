import {
  AccountRegistrationEvent,
  NativeAuthenticationMethod,
  type Order,
  OrderStateTransitionEvent,
  PasswordResetEvent,
} from '@vendure/core';
import { EmailEventListener } from '@vendure/email-plugin';

import { resolveEmailLocale } from '../email-templates/i18n.js';
import { NewsletterConfirmRequestedEvent } from '../plugins/hurc-newsletter/newsletter-confirm-requested.event.js';

function formatTotal(order: Order): string {
  const minorUnits = order.totalWithTax;
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: order.currencyCode,
  }).format(minorUnits / 100);
}

function customerEmailOrThrow(order: Order): string {
  if (!order.customer) {
    throw new Error(`Order ${order.code} has no customer; cannot send email`);
  }
  return order.customer.emailAddress;
}

function getNative(user: AccountRegistrationEvent['user']): NativeAuthenticationMethod | undefined {
  return user.authenticationMethods.find(
    (m): m is NativeAuthenticationMethod => m instanceof NativeAuthenticationMethod,
  );
}

const orderConfirmationHandler = new EmailEventListener('order-confirmation')
  .on(OrderStateTransitionEvent)
  .filter(
    (event) =>
      event.toState === 'PaymentSettled' &&
      event.fromState !== 'Modifying' &&
      !!event.order.customer,
  )
  .setRecipient((event) => customerEmailOrThrow(event.order))
  .setFrom('{{ fromAddress }}')
  .setSubject('Order confirmation — #{{ orderCode }}')
  .setTemplateVars((event) => ({
    locale: resolveEmailLocale(event.ctx.languageCode),
    customerFirstName: event.order.customer?.firstName ?? 'there',
    orderCode: event.order.code,
    orderTotalFormatted: formatTotal(event.order),
  }));

const welcomeHandler = new EmailEventListener('welcome')
  .on(AccountRegistrationEvent)
  .filter((event) => {
    const native = getNative(event.user);
    return !!native?.identifier;
  })
  .setRecipient((event) => {
    const native = getNative(event.user);
    if (!native) {
      throw new Error('AccountRegistrationEvent: user has no native auth');
    }
    return native.identifier;
  })
  .setFrom('{{ fromAddress }}')
  .setSubject('Welcome to HURC')
  .setTemplateVars((event) => {
    const native = getNative(event.user);
    return {
      locale: resolveEmailLocale(event.ctx.languageCode),
      customerFirstName: event.user.identifier.split('@')[0] ?? 'friend',
      verifyUrl: `{{ storefrontUrl }}/account/verify?token=${native?.verificationToken ?? ''}`,
    };
  });

const passwordResetHandler = new EmailEventListener('password-reset')
  .on(PasswordResetEvent)
  .setRecipient((event) => event.user.identifier)
  .setFrom('{{ fromAddress }}')
  .setSubject('Reset your HURC password')
  .setTemplateVars((event) => {
    const native = getNative(event.user);
    return {
      locale: resolveEmailLocale(event.ctx.languageCode),
      resetUrl: `{{ storefrontUrl }}/account/reset-password?token=${native?.passwordResetToken ?? ''}`,
    };
  });

const orderShippedHandler = new EmailEventListener('order-shipped')
  .on(OrderStateTransitionEvent)
  .filter((event) => event.toState === 'Shipped' && !!event.order.customer)
  .setRecipient((event) => customerEmailOrThrow(event.order))
  .setFrom('{{ fromAddress }}')
  .setSubject('Your HURC order is on its way')
  .setTemplateVars((event) => ({
    locale: resolveEmailLocale(event.ctx.languageCode),
    customerFirstName: event.order.customer?.firstName ?? 'there',
    orderCode: event.order.code,
  }));

const newsletterConfirmHandler = new EmailEventListener('newsletter-confirm')
  .on(NewsletterConfirmRequestedEvent)
  .setRecipient((event) => event.email)
  .setFrom('{{ fromAddress }}')
  .setSubject('Confirm your HURC newsletter subscription')
  .setTemplateVars((event) => ({
    locale: event.locale,
    confirmUrl: `{{ storefrontUrl }}/newsletter/confirm?token=${encodeURIComponent(event.token)}`,
  }));

/**
 * Handlers wired in 2.4 + 2.7 (newsletter).
 */
export const hurcEmailHandlers = [
  orderConfirmationHandler,
  welcomeHandler,
  passwordResetHandler,
  orderShippedHandler,
  newsletterConfirmHandler,
];
