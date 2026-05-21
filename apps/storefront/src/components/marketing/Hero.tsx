import { Button } from '@hurc/ui';
import { ArrowRight } from '@hurc/ui/icons';
import { getTranslations } from 'next-intl/server';

import { EditorialImage } from '@/components/editorial/EditorialImage';
import { Link } from '@/i18n/navigation';

export type HeroOverride = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  image?: { asset?: { _ref: string }; alt?: string };
  primaryCta?: { label?: string; href?: string };
};

type Props = {
  override?: HeroOverride | null;
};

export async function Hero({ override }: Props = {}) {
  const t = await getTranslations('home.hero');
  const tc = await getTranslations('common');

  const eyebrow = override?.eyebrow ?? tc('tagline');
  const title = override?.title ?? t('title');
  const subtitle = override?.subtitle ?? t('subtitle');
  const ctaLabel = override?.primaryCta?.label ?? t('shop');
  const ctaHref = override?.primaryCta?.href ?? '/collections';

  return (
    <section
      className="relative isolate flex min-h-[80vh] items-end overflow-hidden bg-[var(--color-surface-900)]"
      aria-labelledby="hero-title"
    >
      {override?.image ? (
        <div aria-hidden className="absolute inset-0 -z-10">
          <EditorialImage
            source={override.image as never}
            width={2400}
            height={1600}
            sizes="100vw"
            priority
            fill
            className="object-cover opacity-70"
          />
          <div className="via-[var(--color-surface-900)]/50 absolute inset-0 bg-gradient-to-t from-[var(--color-surface-900)] to-transparent" />
        </div>
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_25%,rgba(230,57,70,0.18),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(255,255,255,0.06),transparent_60%)]"
        />
      )}

      <div className="mx-auto w-full max-w-7xl px-4 py-24 md:px-6 md:py-32">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-muted)]">{eyebrow}</p>
        <h1
          id="hero-title"
          className="mt-6 max-w-4xl text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.9] tracking-tight"
        >
          {title}
        </h1>
        <p className="mt-8 max-w-xl text-lg text-[var(--color-muted)]">{subtitle}</p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button asChild intent="primary" size="lg">
            <Link href={ctaHref as never}>
              {ctaLabel}
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild intent="secondary" size="lg">
            <Link href="/story">{t('story')}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
