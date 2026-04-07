# 🏛️ STT Pekerjaan Umum - Ultimate System Architecture

## 🏗️ 1. High-Performance Tech Stack (2026 Edition)

### Backend & Content Engine
- **Core**: Payload CMS 3.0 (Next.js Native) - Integrated within the main application.
- **Runtime**: Node.js 22 LTS (via Next.js).
- **Database**: PostgreSQL 16 (Managed) + `pgvector` for AI-powered search.
- **Storage**: Local Storage (Dev) / Cloudinary & AWS S3 (Prod).

### Frontend & Edge Orchestration
- **Framework**: Next.js 15+ (App Router) + Partial Prerendering (PPR).
- **Language**: TypeScript 5.x (Strict Mode).
- **Styling**: Tailwind CSS 4.0 + Shadcn UI.
- **Animations**: GSAP (GreenSock) + `@gsap/react` for high-performance motion orchestration.
- **Data Fetching**: Payload Local API (Zero-latency server-side fetching).

### Intelligence & Reliability
- **Type Safety**: Payload Generated Types + Zod Validation.
- **Search**: Payload search engine with PostgreSQL backend.
- **Monitoring**: Sentry (Error Tracking) + Umami Analytics (Privacy-focused).

---

## 📊 2. Data Models (The Blueprint)

### A. Academic & Organization (Collections)
| Entity | Fields | Relations |
| :--- | :--- | :--- |
| **Faculty** | `name`, `slug`, `description`, `logo`, `color_theme` | Parent of: `Major` |
| **Major** | `name`, `slug`, `degree` (Enum), `accreditation` (Enum), `vision_mission` (RichText) | Child of: `Faculty` |
| **Lecturer** | `name`, `nidn`, `photo`, `expertise` (Array), `scholar_link`, `is_structural` (Boolean) | Child of: `Major` |
| **Facility** | `name`, `slug`, `description`, `gallery` (Uploads), `location_floor` | Optional Child of: `Faculty` |

### B. Communication & Media (Collections)
| Entity | Fields | Relations |
| :--- | :--- | :--- |
| **News** | `title`, `slug`, `content` (Lexical), `featured_image`, `is_featured` (Boolean) | Refs: `Category`, `Major` |
| **Event** | `title`, `slug`, `date_start`, `date_end`, `location`, `registration_url` | Refs: `Category` |
| **Category** | `name`, `slug`, `color_code` | Refs: `News`, `Event` |
| **Document** | `title`, `file` (Upload), `category` (SK, Kurikulum, Panduan), `year` | Optional Ref: `Major` |

### C. Global & Admissions (Single Types / Globals)
| Entity | Key Components |
| :--- | :--- |
| **Global Config** | `site_name`, `logo`, `favicon`, `address_text`, `Maps_url`, `social_links` |
| **Admission Info** | `banner_image`, `is_open` (Toggle), `registration_steps`, `tuition_fees` |
| **Hero Section** | `headline`, `subheadline`, `cta_button`, `background_video_url` |

---

## 🛠️ 3. Engineering Principles & Security
1. **Local API Strategy**: Use Payload's Local API for all internal data fetching to eliminate network overhead.
2. **Media Optimization**: Auto-convert to `.webp` via Sharp for efficient serving.
3. **Security**: Role-Based Access Control (RBAC) via Payload Auth.
4. **Accessibility**: All UI components must be WCAG 2.1 compliant (Radix UI primitives).
5. **Mobile-First Optimization**: Layouts and interactions must be thumb-friendly (min 44x44px touch targets).