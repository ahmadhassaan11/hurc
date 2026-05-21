import {
  PortableText as ReactPortableText,
  type PortableTextComponents,
} from '@portabletext/react';

import { EditorialImage } from './EditorialImage';

type Props = {
  value: unknown;
  className?: string;
};

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mb-6 mt-12 text-3xl font-bold tracking-tight md:text-4xl">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-10 text-2xl font-bold tracking-tight">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-10 border-l-2 border-[var(--color-accent)] pl-6 text-xl italic text-[var(--color-muted)]">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="my-5 text-lg leading-relaxed">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="my-6 list-disc space-y-2 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="my-6 list-decimal space-y-2 pl-6">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-lg leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="text-lg leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = (value as { href?: string } | undefined)?.href ?? '#';
      const newTab = (value as { newTab?: boolean } | undefined)?.newTab;
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(newTab || isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="underline decoration-[var(--color-accent)] underline-offset-4 transition-colors hover:text-[var(--color-accent)]"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const v = value as { alt?: string; caption?: string } & Record<string, unknown>;
      return (
        <figure className="my-10">
          <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-surface-800)]">
            <EditorialImage
              source={v as never}
              width={1600}
              height={900}
              sizes="(max-width: 768px) 100vw, 800px"
              fill
              className="object-cover"
            />
          </div>
          {v.caption ? (
            <figcaption className="mt-3 text-sm text-[var(--color-muted)]">{v.caption}</figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export function PortableText({ value, className }: Props) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className={className}>
      <ReactPortableText value={value as never} components={components} />
    </div>
  );
}
