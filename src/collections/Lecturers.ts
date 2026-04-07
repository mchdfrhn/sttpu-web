import type { CollectionConfig } from 'payload';

export const Lecturers: CollectionConfig = {
  slug: 'lecturers',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'nidn',
      type: 'text',
      unique: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'expertise',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'scholar_link',
      type: 'text',
    },
    {
      name: 'is_structural',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'major',
      type: 'relationship',
      relationTo: 'majors',
    },
  ],
};
