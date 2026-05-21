import { defineField, defineType } from 'sanity';

import { EDITORIAL_LOCALE_LIST } from '../locales';

/**
 * Singleton — one document per locale. Every override is optional; the
 * storefront falls back to its i18n strings + gradient backgrounds when
 * a slice is absent.
 */
export const homepage = defineType({
  name: 'homepage',
  title: 'Home page',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      type: 'string',
      options: { list: EDITORIAL_LOCALE_LIST, layout: 'radio' },
      initialValue: 'en',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroOverride',
      title: 'Hero override',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({
          name: 'title',
          type: 'string',
          description: 'Replaces the i18n title; required if heroOverride is used',
        }),
        defineField({ name: 'subtitle', type: 'text', rows: 2 }),
        defineField({
          name: 'image',
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
        }),
        defineField({
          name: 'primaryCta',
          title: 'Primary CTA',
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string' }),
            defineField({
              name: 'href',
              type: 'string',
              description: 'Internal path starting with "/"',
              validation: (rule) =>
                rule.custom((value) =>
                  !value || value.startsWith('/')
                    ? true
                    : 'Use a path starting with "/" — external CTAs are not supported',
                ),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'brandStatementOverride',
      title: 'Brand statement override',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({ name: 'headline', type: 'string' }),
        defineField({ name: 'body', type: 'text', rows: 3 }),
      ],
    }),
  ],
  preview: {
    select: { language: 'language', title: 'heroOverride.title' },
    prepare({ language, title }) {
      return {
        title: `Homepage [${(language as string | undefined)?.toUpperCase() ?? '?'}]`,
        subtitle: (title as string | undefined) ?? '(using i18n defaults)',
      };
    },
  },
});
