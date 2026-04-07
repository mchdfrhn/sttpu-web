import type { CollectionConfig } from 'payload';

export const Documents: CollectionConfig = {
  slug: 'documents',
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
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'SK', value: 'SK' },
        { label: 'Kurikulum', value: 'Kurikulum' },
        { label: 'Panduan', value: 'Panduan' },
      ],
      required: true,
    },
    {
      name: 'year',
      type: 'number',
    },
    {
      name: 'major',
      type: 'relationship',
      relationTo: 'majors',
    },
  ],
};
