import 'server-only';
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { 
  HeroSection, 
  GlobalConfig, 
  News, 
  Event, 
  AdmissionInfo, 
  CampusStatistic, 
  NavigationMenu,
  Faculty,
  Major,
  WithId
} from './cms-types';

/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║       🎓 STT Pekerjaan Umum — Payload CMS Client            ║
 * ║  High-performance Local API bridge for Next.js 15+         ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

export const getPayloadClient = async () => {
  return await getPayload({
    config: configPromise,
  });
};

// ─────────────────────────────────────────────────────────────
// 📡 Data Fetching Helpers (Mirrors strapi.ts)
// ─────────────────────────────────────────────────────────────

export const getHeroSection = async () => {
  const payload = await getPayloadClient();
  const data = await payload.findGlobal({
    slug: 'hero-section',
  });
  return { data: data as unknown as WithId<HeroSection> };
};

export const getGlobalConfig = async () => {
  const payload = await getPayloadClient();
  const data = await payload.findGlobal({
    slug: 'global-setting',
  });
  return { data: data as unknown as WithId<GlobalConfig> };
};

export const getFeaturedNews = async (limit = 5) => {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'news',
    where: {
      is_featured: {
        equals: true,
      },
    },
    limit,
    sort: '-createdAt',
  });
  return { data: res.docs as unknown as WithId<News>[] };
};

export const getEvents = async (options?: { pagination?: { pageSize?: number } }) => {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'events',
    limit: options?.pagination?.pageSize || 10,
    sort: 'date_start',
  });
  return { data: res.docs as unknown as WithId<Event>[] };
};

export const getAdmissionInfo = async () => {
  const payload = await getPayloadClient();
  const data = await payload.findGlobal({
    slug: 'admission-info',
  });
  return { data: data as unknown as WithId<AdmissionInfo> };
};

export const getCampusStatistic = async () => {
  const payload = await getPayloadClient();
  const data = await payload.findGlobal({
    slug: 'campus-statistic',
  });
  return { data: data as unknown as WithId<CampusStatistic> };
};

export const getNavigationMenus = async () => {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'navigation-menus',
    where: {
      parent: {
        exists: false,
      },
    },
    sort: 'order',
    depth: 2,
  });
  return { data: res.docs as unknown as NavigationMenu[] };
};

// -- Academic & Organization --

export const getFaculties = async () => {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'faculties',
    sort: 'name',
  });
  return { data: res.docs as unknown as WithId<Faculty>[] };
};

export const getFacultyBySlug = async (slug: string) => {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'faculties',
    where: {
      slug: {
        equals: slug,
      },
    },
  });
  return { data: res.docs as unknown as WithId<Faculty>[] };
};

export const getMajors = async () => {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'majors',
    sort: 'name',
  });
  return { data: res.docs as unknown as WithId<Major>[] };
};

export const getMajorBySlug = async (slug: string) => {
  const payload = await getPayloadClient();
  const res = await payload.find({
    collection: 'majors',
    where: {
      slug: {
        equals: slug,
      },
    },
  });
  return { data: res.docs as unknown as WithId<Major>[] };
};

// ─────────────────────────────────────────────────────────────
// 🛠️ Utility
// ─────────────────────────────────────────────────────────────

export { getMediaUrl } from './cms-utils';
