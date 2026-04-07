import type { GlobalConfig } from 'payload';

export const GlobalSetting: GlobalConfig = {
  slug: 'global-setting',
  fields: [
    {
      name: 'site_name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'address_text',
      type: 'textarea',
    },
    {
      name: 'maps_url',
      type: 'text',
    },
    {
      name: 'social_links',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
        {
          name: 'is_external',
          type: 'checkbox',
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'text',
        },
        {
          name: 'whatsapp',
          type: 'text',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'office_hours',
          type: 'text',
        },
      ],
    },
  ],
};
