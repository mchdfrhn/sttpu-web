/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║       🎓 STT Pekerjaan Umum — Strapi API Client             ║
 * ║  Type-safe, elegant bridge between Strapi v5 & Next.js 15   ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

import qs from 'qs';

// ─────────────────────────────────────────────────────────────
// 🌐 Config
// ─────────────────────────────────────────────────────────────

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN ?? '';

// ─────────────────────────────────────────────────────────────
// 🧩 Strapi Base Types (v5 flat format)
// ─────────────────────────────────────────────────────────────

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number | null;
  height: number | null;
  formats: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  } | null;
}

interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiMeta {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string | null;
}

export type WithId<T> = T & StrapiMeta;

export interface StrapiListResponse<T> {
  data: WithId<T>[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: WithId<T>;
  meta: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────
// 🧩 Component Types (matches /src/components/)
// ─────────────────────────────────────────────────────────────

/** shared.link */
export interface SharedLink {
  id: number;
  label: string;
  url: string;
  is_external: boolean;
  is_highlighted?: boolean;
}

/** shared.seo */
export interface SharedSEO {
  id: number;
  meta_title: string;
  meta_description: string;
  share_image: StrapiMedia | null;
  keywords: string | null;
}

/** shared.contact */
export interface SharedContact {
  id: number;
  email: string | null;
  whatsapp: string | null;
  phone: string | null;
  office_hours: string | null;
}

/** academic.curriculum */
export interface AcademicCurriculum {
  id: number;
  semester: number;
  subjectCode: string;
  subjectName: string;
  sks: number;
}

// ─────────────────────────────────────────────────────────────
// 🏛️ Collection Type Interfaces (matches ARCHITECTURE.md)
// ─────────────────────────────────────────────────────────────

// A. Academic & Organization

export interface Faculty {
  name: string;
  slug: string;
  description: string | null;
  logo: StrapiMedia | null;
  color_theme: string | null;
  majors?: WithId<Major>[];
  facilities?: WithId<Facility>[];
}

export type Degree = 'S1' | 'S2' | 'S3' | 'D3';
export type Accreditation = 'A' | 'B' | 'C' | 'Unggul';

export interface Major {
  name: string;
  slug: string;
  degree: Degree;
  accreditation: Accreditation | null;
  vision_mission: string | null;
  faculty?: WithId<Faculty>;
  lecturers?: WithId<Lecturer>[];
  news?: WithId<News>[];
  documents?: WithId<Document>[];
}

export interface Lecturer {
  name: string;
  nidn: string | null;
  photo: StrapiMedia | null;
  expertise: string[] | null;
  scholar_link: string | null;
  is_structural: boolean;
  major?: WithId<Major>;
}

export interface Facility {
  name: string;
  slug: string;
  description: string | null;
  gallery: StrapiMedia[] | null;
  location_floor: string | null;
  faculty?: WithId<Faculty>;
}

// B. Communication & Media

export interface News {
  title: string;
  slug: string;
  content: unknown[] | null;
  featured_image: StrapiMedia | null;
  is_featured: boolean;
  categories?: WithId<Category>[];
  majors?: WithId<Major>[];
}

export interface Event {
  title: string;
  slug: string;
  date_start: string;
  date_end: string | null;
  location: string | null;
  registration_url: string | null;
  categories?: WithId<Category>[];
}

export interface Category {
  name: string;
  slug: string;
  color_code: string | null;
  news?: WithId<News>[];
  events?: WithId<Event>[];
}

export type DocumentCategory = 'SK' | 'Kurikulum' | 'Panduan';

export interface Document {
  title: string;
  file: StrapiMedia;
  category: DocumentCategory;
  year: number | null;
  major?: WithId<Major>;
}

// C. Single Types

export interface GlobalConfig {
  site_name: string;
  logo: StrapiMedia | null;
  favicon: StrapiMedia | null;
  address_text: string | null;
  maps_url: string | null;
  social_links: SharedLink[];
}

export interface AdmissionInfo {
  banner_image: StrapiMedia | null;
  is_open: boolean;
  registration_steps: SharedLink[];
  tuition_fees: unknown | null;
}

export interface HeroSection {
  headline: string;
  subheadline: string | null;
  cta_button: SharedLink | null;
  background_video_url: string | null;
}

// ─────────────────────────────────────────────────────────────
// ⚙️ Query Params Type
// ─────────────────────────────────────────────────────────────

export interface StrapiQueryParams {
  fields?: string[];
  populate?: string | string[] | Record<string, unknown>;
  filters?: Record<string, unknown>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  publicationState?: 'live' | 'preview';
}

// ─────────────────────────────────────────────────────────────
// 🔌 Core Fetcher
// ─────────────────────────────────────────────────────────────

export class StrapiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'StrapiError';
  }
}

async function strapiRequest<T>(
  path: string,
  params?: StrapiQueryParams,
  options?: RequestInit,
): Promise<T> {
  const queryString = params ? `?${qs.stringify(params, { encodeValuesOnly: true })}` : '';
  const url = `${STRAPI_URL}/api${path}${queryString}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options?.headers ?? {}) },
    next: { revalidate: 60 }, // ISR — 60s per Engineering Principles
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new StrapiError(error?.error?.message ?? `Request failed: ${response.status}`, response.status);
  }

  return response.json() as Promise<T>;
}

// ─────────────────────────────────────────────────────────────
// 📡 Generic API Layer
// ─────────────────────────────────────────────────────────────

export const fetchMany = <T>(endpoint: string, params?: StrapiQueryParams) =>
  strapiRequest<StrapiListResponse<T>>(endpoint, params);

export const fetchOne = <T>(endpoint: string, documentId: string, params?: StrapiQueryParams) =>
  strapiRequest<StrapiSingleResponse<T>>(`${endpoint}/${documentId}`, params);

export const fetchSingle = <T>(endpoint: string, params?: StrapiQueryParams) =>
  strapiRequest<StrapiSingleResponse<T>>(endpoint, params);

// ─────────────────────────────────────────────────────────────
// 🏛️ Content-Type Helpers
// ─────────────────────────────────────────────────────────────

// -- Academic & Organization --

export const getFaculties = (params?: StrapiQueryParams) =>
  fetchMany<Faculty>('/faculties', {
    populate: { logo: true, majors: { fields: ['name', 'slug', 'degree', 'accreditation'] } },
    sort: 'name:asc',
    ...params,
  });

export const getFacultyBySlug = (slug: string) =>
  fetchMany<Faculty>('/faculties', {
    filters: { slug: { $eq: slug } },
    populate: {
      logo: true,
      majors: { populate: { lecturers: { fields: ['name', 'nidn', 'is_structural'] } } },
      facilities: { fields: ['name', 'slug', 'location_floor'] },
    },
  });

export const getMajors = (params?: StrapiQueryParams) =>
  fetchMany<Major>('/majors', {
    populate: { faculty: { fields: ['name', 'slug', 'color_theme'] } },
    sort: 'name:asc',
    ...params,
  });

export const getMajorBySlug = (slug: string) =>
  fetchMany<Major>('/majors', {
    filters: { slug: { $eq: slug } },
    populate: {
      faculty: { fields: ['name', 'slug'] },
      lecturers: { populate: { photo: true } },
    },
  });

export const getLecturers = (params?: StrapiQueryParams) =>
  fetchMany<Lecturer>('/lecturers', {
    populate: { photo: true, major: { fields: ['name', 'slug'] } },
    sort: 'name:asc',
    ...params,
  });

export const getFacilities = (params?: StrapiQueryParams) =>
  fetchMany<Facility>('/facilities', {
    populate: { gallery: true, faculty: { fields: ['name', 'slug'] } },
    sort: 'name:asc',
    ...params,
  });

// -- Communication & Media --

export const getNews = (params?: StrapiQueryParams) =>
  fetchMany<News>('/news', {
    populate: {
      featured_image: true,
      categories: { fields: ['name', 'slug', 'color_code'] },
    },
    sort: 'publishedAt:desc',
    pagination: { pageSize: 10 },
    ...params,
  });

export const getNewsBySlug = (slug: string) =>
  fetchMany<News>('/news', {
    filters: { slug: { $eq: slug } },
    populate: {
      featured_image: true,
      categories: { fields: ['name', 'slug', 'color_code'] },
      majors: { fields: ['name', 'slug'] },
    },
  });

export const getFeaturedNews = (limit = 5) =>
  fetchMany<News>('/news', {
    filters: { is_featured: { $eq: true } },
    populate: { featured_image: true, categories: { fields: ['name', 'color_code'] } },
    sort: 'publishedAt:desc',
    pagination: { pageSize: limit },
  });

export const getEvents = (params?: StrapiQueryParams) =>
  fetchMany<Event>('/events', {
    sort: 'date_start:asc',
    populate: { categories: { fields: ['name', 'color_code'] } },
    ...params,
  });

export const getCategories = (params?: StrapiQueryParams) =>
  fetchMany<Category>('/categories', { sort: 'name:asc', ...params });

export const getDocuments = (params?: StrapiQueryParams) =>
  fetchMany<Document>('/documents', {
    populate: { file: true, major: { fields: ['name', 'slug'] } },
    sort: 'year:desc',
    ...params,
  });

// -- Single Types --

export const getGlobalConfig = () =>
  fetchSingle<GlobalConfig>('/global-setting', {
    populate: { logo: true, favicon: true, social_links: true },
  });

export const getAdmissionInfo = () =>
  fetchSingle<AdmissionInfo>('/admission-info', {
    populate: { banner_image: true, registration_steps: true },
  });

export const getHeroSection = () =>
  fetchSingle<HeroSection>('/hero-section', {
    populate: { cta_button: true },
  });

// ─────────────────────────────────────────────────────────────
// 🛠️ Utility
// ─────────────────────────────────────────────────────────────

/**
 * Returns the absolute URL for a Strapi media file.
 * Prepends STRAPI_URL for relative paths (/uploads/...).
 */
export function getStrapiMedia(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}
