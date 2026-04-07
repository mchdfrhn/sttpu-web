import type { CollectionConfig } from 'payload';

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'featured_image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'is_featured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'majors',
      type: 'relationship',
      relationTo: 'majors',
      hasMany: true,
    },
  ],
};
