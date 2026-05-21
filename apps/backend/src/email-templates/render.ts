import { render } from '@react-email/render';
import * as React from 'react';

import { NewsletterConfirm, type NewsletterConfirmProps } from './newsletter-confirm.js';
import { OrderConfirmation, type OrderConfirmationProps } from './order-confirmation.js';
import { OrderShipped, type OrderShippedProps } from './order-shipped.js';
import { PasswordReset, type PasswordResetProps } from './password-reset.js';
import { Welcome, type WelcomeProps } from './welcome.js';

/**
 * Registry of every React Email template the backend knows how to render.
 * The key is the EmailEventListener `type` string from each handler. The
 * EmailPlugin's TemplateLoader looks templates up by this key.
 *
 * Adding a new template = add a row here + a handler that emits this type.
 */
export type EmailTemplateMap = {
  'order-confirmation': OrderConfirmationProps;
  'order-shipped': OrderShippedProps;
  'password-reset': PasswordResetProps;
  welcome: WelcomeProps;
  'newsletter-confirm': NewsletterConfirmProps;
};

export type EmailTemplateType = keyof EmailTemplateMap;

type Renderer<P> = (props: P) => Promise<string>;

const renderers: { [K in EmailTemplateType]: Renderer<EmailTemplateMap[K]> } = {
  'order-confirmation': (p) => render(React.createElement(OrderConfirmation, p)),
  'order-shipped': (p) => render(React.createElement(OrderShipped, p)),
  'password-reset': (p) => render(React.createElement(PasswordReset, p)),
  welcome: (p) => render(React.createElement(Welcome, p)),
  'newsletter-confirm': (p) => render(React.createElement(NewsletterConfirm, p)),
};

export function isKnownEmailTemplate(type: string): type is EmailTemplateType {
  return type in renderers;
}

/**
 * Render an email by type. The caller is responsible for shaping `props` to
 * match the template — for the EmailPlugin path, the EmailEventHandler's
 * `setTemplateVars` is what guarantees the shape.
 */
export async function renderEmailByType<T extends EmailTemplateType>(
  type: T,
  props: EmailTemplateMap[T],
): Promise<string> {
  return renderers[type](props);
}
