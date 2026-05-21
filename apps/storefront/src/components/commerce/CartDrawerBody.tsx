import { Button } from '@hurc/ui';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';
import { type Locale } from '@/i18n/routing';

import { CartLine, type CartLineData } from './CartLine';
import { CouponForm } from './CouponForm';
import { FreeShippingProgress } from './FreeShippingProgress';
import { OrderSummaryCard } from './OrderSummaryCard';

const FREE_SHIPPING_THRESHOLD_MINOR = 7000;

type CartData = {
  totalQuantity: number;
  subTotalWithTax: number;
  shippingWithTax: number;
  totalWithTax: number;
  currencyCode: string;
  couponCodes: string[];
  lines: CartLineData[];
} | null;

type Props = {
  cart: CartData;
  locale: Locale;
};

export async function CartDrawerBody({ cart, locale }: Props) {
  const t = await getTranslations('commerce.cart');

  if (cart === null || cart.lines.length === 0) {
    return (
      <div className="flex flex-col gap-4 pt-6">
        <p className="text-sm text-[var(--color-muted)]">{t('empty')}</p>
        <Button asChild intent="secondary" size="md">
          <Link href="/">{t('continueShopping')}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto pt-4">
        <FreeShippingProgress
          subtotal={cart.subTotalWithTax}
          threshold={FREE_SHIPPING_THRESHOLD_MINOR}
          currency={cart.currencyCode}
          locale={locale}
        />
        <ul className="mt-2 divide-y divide-[var(--color-line)]">
          {cart.lines.map((line) => (
            <CartLine key={line.id} line={line} locale={locale} />
          ))}
        </ul>
        <CouponForm appliedCodes={cart.couponCodes} />
      </div>

      <div className="border-t border-[var(--color-line)] pt-4">
        <OrderSummaryCard
          subtotal={cart.subTotalWithTax}
          shipping={cart.shippingWithTax > 0 ? cart.shippingWithTax : null}
          total={cart.totalWithTax}
          currency={cart.currencyCode}
          locale={locale}
        />

        <Button asChild intent="primary" size="lg" className="mt-4 w-full">
          <Link href="/checkout">{t('checkout')}</Link>
        </Button>
      </div>
    </div>
  );
}
