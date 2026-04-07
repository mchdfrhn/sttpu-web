import type { CollectionConfig } from 'payload';

export const Events: CollectionConfig = {
  slug: 'events',
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
      name: 'date_start',
      type: 'date',
      required: true,
      admin: {
          date: {
              pickerAppearance: 'dayAndTime',
          }
      }
    },
    {
      name: 'date_end',
      type: 'date',
      admin: {
          date: {
              pickerAppearance: 'dayAndTime',
          }
      }
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'registration_url',
      type: 'text',
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
  ],
};
