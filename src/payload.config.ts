import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

import { Categories } from './collections/Categories';
import { Documents } from './collections/Documents';
import { Events } from './collections/Events';
import { Facilities } from './collections/Facilities';
import { Faculties } from './collections/Faculties';
import { Lecturers } from './collections/Lecturers';
import { Majors } from './collections/Majors';
import { Media } from './collections/Media';
import { News } from './collections/News';
import { NavigationMenus } from './collections/NavigationMenus';

import { AdmissionInfo } from './globals/AdmissionInfo';
import { CampusStatistic } from './globals/CampusStatistic';
import { GlobalSetting } from './globals/GlobalSetting';
import { HeroSection } from './globals/HeroSection';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  collections: [
    {
      slug: 'users',
      auth: true,
      access: {
        delete: () => false,
        update: () => true,
      },
      fields: [],
    },
    Categories,
    Documents,
    Events,
    Facilities,
    Faculties,
    Lecturers,
    Majors,
    Media,
    News,
    NavigationMenus,
  ],
  globals: [
    AdmissionInfo,
    CampusStatistic,
    GlobalSetting,
    HeroSection,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
});
