import { ArrowRight } from '@hurc/ui/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import type { JournalCardDoc } from '@/lib/sanity/queries';

import { EditorialImage } from './EditorialImage';

type Props = {
  post: JournalCardDoc;
};

export function JournalCard({ post }: Props) {
  const t = useTranslations('journal');
  const format = useFormatter();
  const dateString = format.dateTime(new Date(post.publishedAt), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Link
      href={`/journal/${post.slug}` as never}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden border border-[var(--color-line)] bg-[var(--color-surface-800)]">
        {post.heroImage ? (
          <EditorialImage
            source={post.heroImage as never}
            width={800}
            height={600}
            sizes="(max-width: 768px) 100vw, 33vw"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 motion-reduce:transition-none"
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-b from-[var(--color-surface-700)] to-[var(--color-surface-900)]"
          />
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">{dateString}</p>
        <h3 className="mt-2 text-2xl font-bold tracking-tight transition-colors group-hover:text-[var(--color-accent)]">
          {post.title}
        </h3>
        {post.excerpt ? (
          <p className="mt-3 text-base text-[var(--color-muted)]">{post.excerpt}</p>
        ) : null}
        <span className="mt-4 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-[var(--color-muted)] transition-colors group-hover:text-[var(--color-fg)]">
          {t('readMore')}
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden
          />
        </span>
      </div>
    </Link>
  );
}
