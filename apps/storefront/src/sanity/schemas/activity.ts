import { defineField, defineType } from 'sanity';

import { EDITORIAL_LOCALE_LIST } from '../locales';

export const activity = defineType({
  name: 'activity',
  title: 'Activity tile',
  type: 'document',
  description:
    'Editorial overlay for the home-page activity grid. The slug must match a route segment (run, train, yoga, studio).',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 32 },
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
      description: 'Small uppercase label, e.g. "Discipline 01"',
    }),
    defineField({
      name: 'heroImage',
      title: 'Tile image',
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
      name: 'description',
      type: 'text',
      rows: 2,
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
        title: (title as string | undefined) ?? 'Untitled activity',
        subtitle: subtitle ? `[${(subtitle as string).toUpperCase()}]` : '',
        media,
      };
    },
  },
});
