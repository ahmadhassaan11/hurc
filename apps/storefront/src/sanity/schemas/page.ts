import { defineField, defineType } from 'sanity';

import { EDITORIAL_LOCALE_LIST } from '../locales';

export const page = defineType({
  name: 'page',
  title: 'Marketing page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(120),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      description: 'URL slug, e.g. "story" → /<locale>/story',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'language',
      type: 'string',
      options: { list: EDITORIAL_LOCALE_LIST, layout: 'radio' },
      initialValue: 'en',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      type: 'string',
      description: 'Small uppercase label above the page heading',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
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
      name: 'body',
      type: 'portableTextBody',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      type: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
      media: 'heroImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: (title as string | undefined) ?? 'Untitled page',
        subtitle: subtitle ? `/${subtitle as string}` : '',
        media,
      };
    },
  },
});
