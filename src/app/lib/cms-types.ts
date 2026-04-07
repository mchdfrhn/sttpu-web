/**
 * 🎓 STT Pekerjaan Umum — Core CMS Types
 * Shared between Strapi (legacy) and Payload (new)
 */

export interface CMSMedia {
  id: any;
  url: string;
  alt?: string | null;
  alternativeText?: string | null;
  width?: number | null;
  height?: number | null;
  formats?: {
    thumbnail?: CMSMediaFormat;
    small?: CMSMediaFormat;
    medium?: CMSMediaFormat;
    large?: CMSMediaFormat;
  } | null;
}

interface CMSMediaFormat {
  url: string;
  width: number;
  height: number;
}

export interface CMSMeta {
  id: any;
  documentId?: any;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string | null;
  locale?: string | null;
}

export type WithId<T> = T & CMSMeta;

// ─────────────────────────────────────────────────────────────
// 🧩 Component Types
// ─────────────────────────────────────────────────────────────

export interface SharedLink {
  id: any;
  label: string;
  url: string;
  is_external: boolean;
  is_highlighted?: boolean;
}

export interface SharedContact {
  id: any;
  email: string | null;
  whatsapp: string | null;
  phone: string | null;
  office_hours: string | null;
}

// ─────────────────────────────────────────────────────────────
// 🏛️ Collection Types
// ─────────────────────────────────────────────────────────────

export interface Faculty {
  name: string;
  slug: string;
  description: string | null;
  logo: CMSMedia | null;
  color_theme: string | null;
  majors?: WithId<Major>[];
}

export type Degree = 'S1' | 'S2' | 'S3' | 'D3';
export type Accreditation = 'A' | 'B' | 'C' | 'Unggul';

export interface Major {
  name: string;
  slug: string;
  degree: Degree;
  accreditation: Accreditation | null;
  vision_mission: any | null; // RichText
  faculty?: WithId<Faculty>;
}

export interface News {
  title: string;
  slug: string;
  content: any | null;
  featured_image: CMSMedia | null;
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
}

// ─────────────────────────────────────────────────────────────
// 🏛️ Global Types
// ─────────────────────────────────────────────────────────────

export interface GlobalConfig {
  site_name: string;
  logo: CMSMedia | null;
  favicon: CMSMedia | null;
  address_text: string | null;
  maps_url: string | null;
  social_links: SharedLink[];
  contact: SharedContact | null;
}

export interface StatItem {
  id: any;
  label: string;
  value: string;
  icon_name: string | null;
}

export interface CampusStatistic {
  stats: StatItem[];
}

export interface NavigationMenu {
  id: any;
  documentId?: any;
  label: string;
  url: string;
  order: number;
  is_highlighted: boolean;
  children?: NavigationMenu[];
}

export interface AdmissionInfo {
  banner_image: CMSMedia | null;
  is_open: boolean;
  registration_steps: SharedLink[];
  tuition_fees: any | null;
}

export interface HeroSection {
  headline: string;
  subheadline: string | null;
  cta_button: SharedLink | null;
  background_video_url: string | null;
}
