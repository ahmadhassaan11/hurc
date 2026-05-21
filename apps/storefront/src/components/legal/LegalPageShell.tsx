import { type ReactNode } from 'react';

type Props = {
  eyebrow?: string;
  title: string;
  lastUpdated?: string;
  children: ReactNode;
};

export function LegalPageShell({ eyebrow, title, lastUpdated, children }: Props) {
  return (
    <main id="content" className="mx-auto max-w-3xl px-4 py-24 md:px-6 md:py-32">
      <header className="mb-12 border-b border-[var(--color-line)] pb-8">
        {eyebrow !== undefined ? (
          <p className="text-xs uppercase tracking-[0.4em] text-[var(--color-muted)]">{eyebrow}</p>
        ) : null}
        <h1 className="mt-4 text-[clamp(2rem,6vw,4rem)] font-bold leading-[0.95] tracking-tight">
          {title}
        </h1>
        {lastUpdated !== undefined ? (
          <p className="mt-4 text-xs text-[var(--color-muted)]">{lastUpdated}</p>
        ) : null}
      </header>
      <article className="prose prose-invert prose-lg max-w-none [&_a]:underline [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:text-xl [&_li]:my-2 [&_p]:my-4 [&_p]:leading-relaxed [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </article>
    </main>
  );
}
