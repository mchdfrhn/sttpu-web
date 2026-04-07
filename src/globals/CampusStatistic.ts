import type { GlobalConfig } from 'payload';

export const CampusStatistic: GlobalConfig = {
  slug: 'campus-statistic',
  fields: [
    {
      name: 'stats',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'icon_name',
          type: 'text',
        },
      ],
    },
  ],
};
