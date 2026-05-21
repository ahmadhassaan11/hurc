import { ArrowRight } from '@hurc/ui/icons';
import { getTranslations } from 'next-intl/server';

import { EditorialImage } from '@/components/editorial/EditorialImage';
import { Link } from '@/i18n/navigation';

const activities = [
  { key: 'run', href: '/run' },
  { key: 'train', href: '/train' },
  { key: 'yoga', href: '/yoga' },
  { key: 'studio', href: '/studio' },
] as const;

export type ActivityOverride = {
  slug: string;
  eyebrow?: string | undefined;
  title?: string | undefined;
  heroImage?: { asset?: { _ref: string }; alt?: string } | undefined;
};

type Props = {
  overrides?: ActivityOverride[];
};

export async function ActivityGrid({ overrides }: Props = {}) {
  const t = await getTranslations('home.activities');
  const overrideBySlug = new Map((overrides ?? []).map((o) => [o.slug, o]));

  return (
    <section aria-labelledby="activities-title" className="mx-auto max-w-7xl px-4 py-24 md:px-6">
      <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
            {t('eyebrow')}
          </p>
          <h2 id="activities-title" className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
            {t('title')}
          </h2>
        </div>
        <p className="max-w-md text-sm text-[var(--color-muted)]">{t('description')}</p>
      </div>

      <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {activities.map((activity) => {
          const override = overrideBySlug.get(activity.key);
          const eyebrow = override?.eyebrow ?? t(`${activity.key}.eyebrow`);
          const title = override?.title ?? t(`${activity.key}.title`);
          return (
            <li key={activity.key}>
              <Link
                href={activity.href as never}
                className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface-800)] p-6 transition-colors hover:bg-[var(--color-surface-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                {override?.heroImage ? (
                  <div aria-hidden className="absolute inset-0 -z-10">
                    <EditorialImage
                      source={override.heroImage as never}
                      width={600}
                      height={800}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      fill
                      className="object-cover opacity-60 transition-opacity group-hover:opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>
                ) : null}
                <span className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">
                  {eyebrow}
                </span>
                <span className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</span>
                <span className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-fg)]">
                  {t('cta')}
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                    aria-hidden
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
