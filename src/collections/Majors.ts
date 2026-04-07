import type { CollectionConfig } from 'payload';

export const Majors: CollectionConfig = {
  slug: 'majors',
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
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'degree',
      type: 'select',
      options: [
        { label: 'S1', value: 'S1' },
        { label: 'S2', value: 'S2' },
        { label: 'S3', value: 'S3' },
        { label: 'D3', value: 'D3' },
      ],
      required: true,
    },
    {
      name: 'accreditation',
      type: 'select',
      options: [
        { label: 'A', value: 'A' },
        { label: 'B', value: 'B' },
        { label: 'C', value: 'C' },
        { label: 'Unggul', value: 'Unggul' },
      ],
    },
    {
       name: 'vision_mission',
       type: 'richText',
    },
    {
      name: 'faculty',
      type: 'relationship',
      relationTo: 'faculties',
      required: true,
    },
  ],
};
