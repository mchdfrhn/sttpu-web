import type { GlobalConfig } from 'payload';

export const AdmissionInfo: GlobalConfig = {
  slug: 'admission-info',
  fields: [
    {
      name: 'banner_image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'is_open',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'registration_steps',
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
      ],
    },
    {
       name: 'tuition_fees',
       type: 'richText'
    }
  ],
};
