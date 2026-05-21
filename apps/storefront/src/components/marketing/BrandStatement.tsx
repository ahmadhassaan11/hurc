import { getTranslations } from 'next-intl/server';

export type BrandStatementOverride = {
  eyebrow?: string;
  headline?: string;
  body?: string;
};

type Props = {
  override?: BrandStatementOverride | null;
};

export async function BrandStatement({ override }: Props = {}) {
  const t = await getTranslations('home.statement');

  const eyebrow = override?.eyebrow ?? t('eyebrow');
  const headline = override?.headline ?? t('headline');
  const body = override?.body ?? t('body');

  return (
    <section
      aria-labelledby="brand-statement-title"
      className="mx-auto max-w-5xl px-4 py-24 md:px-6 md:py-32"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">{eyebrow}</p>
      <h2
        id="brand-statement-title"
        className="mt-6 max-w-3xl text-[clamp(2rem,5vw,4rem)] font-bold leading-tight tracking-tight"
      >
        {headline}
      </h2>
      <p className="mt-8 max-w-2xl text-lg text-[var(--color-muted)]">{body}</p>
    </section>
  );
}
