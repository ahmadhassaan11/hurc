import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      description: 'Overrides document title in <title> + og:title',
      validation: (rule) => rule.max(70).warning('Search results truncate beyond ~60 characters'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.max(180).warning('Search results truncate beyond ~155 characters'),
    }),
    defineField({
      name: 'image',
      title: 'Social share image',
      type: 'image',
      options: { hotspot: true },
      description: '1200×630 recommended for og:image',
    }),
  ],
});
