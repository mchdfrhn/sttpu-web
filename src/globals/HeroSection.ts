import type { GlobalConfig } from 'payload';

export const HeroSection: GlobalConfig = {
  slug: 'hero-section',
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
    },
    {
      name: 'subheadline',
      type: 'textarea',
    },
    {
      name: 'cta_button',
      type: 'group',
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
           type: 'checkbox'
        }
      ],
    },
    {
      name: 'background_video_url',
      type: 'text',
    },
  ],
};
