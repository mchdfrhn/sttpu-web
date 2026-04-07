import type { CollectionConfig } from 'payload';

export const NavigationMenus: CollectionConfig = {
  slug: 'navigation-menus',
  admin: {
    useAsTitle: 'label',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'is_highlighted',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'navigation-menus',
    },
  ],
};
