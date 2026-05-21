import { defineField, defineType } from 'sanity';

import { EDITORIAL_LOCALE_LIST } from '../locales';

export const journalPost = defineType({
  name: 'journalPost',
  title: 'Journal post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required().min(3).max(120),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
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
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      type: 'string',
      initialValue: 'HURC',
    }),
    defineField({
      name: 'excerpt',
      type: 'text',
      rows: 3,
      description: 'Used in journal index cards and SEO description fallback',
      validation: (rule) => rule.max(280),
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
      subtitle: 'language',
      media: 'heroImage',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: (title as string | undefined) ?? 'Untitled',
        subtitle: subtitle ? `[${(subtitle as string).toUpperCase()}]` : '',
        media,
      };
    },
  },
});
