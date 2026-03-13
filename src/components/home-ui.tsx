"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  HardHat,
  GraduationCap,
  MapPin,
  Phone,
  ArrowRight,
  LucideIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Faculty,
  News,
  Event,
  GlobalConfig,
  getStrapiMedia,
  WithId,
} from "@/app/lib/strapi";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface NavLinkItem {
  label: string;
  url: string;
  is_highlighted?: boolean;
  subLinks?: NavLinkItem[];
}

export function Navbar({
  globalConfig,
}: {
  globalConfig: WithId<GlobalConfig>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMobilePaths, setActiveMobilePaths] = useState<string[]>([]);

  const toggleMobileSub = (label: string, level: number) => {
    setActiveMobilePaths((prev) => {
      const newPaths = [...prev.slice(0, level)];
      if (prev[level] === label) {
        return newPaths;
      }
      newPaths[level] = label;
      return newPaths;
    });
  };

  useEffect(() => {
    // Force scroll to top on mount/refresh
    window.scrollTo(0, 0);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", url: "/" },
    { label: "Tentang", url: "/tentang" },
    {
      label: "Akademik",
      url: "/akademik",
      subLinks: [
        {
          label: "SIAKAD",
          url: "#",
          subLinks: [
            {
              label: "Portal Dosen",
              url: "https://sttsaptataruna.portaldosen.siakad.tech/",
            },
            {
              label: "Portal Mahasiswa",
              url: "https://mhs.sttpu.civitas.id/",
            },
            {
              label: "Portal Orang Tua",
              url: "https://ortu.sttpu.civitas.id/",
            },
            {
              label: "Panduan SIAKAD",
              url: "#",
              subLinks: [
                {
                  label: "Panduan Dosen",
                  url: "#",
                },
                {
                  label: "Panduan Mahasiswa",
                  url: "https://www.youtube.com/watch?v=WWsJ1KaBqCo&list=PL92IvqVb8kkidupuI2ctfwqM6es7C9o0v",
                },
                {
                  label: "Panduan Orang Tua",
                  url: "#",
                },
              ],
            },
          ],
        },
        {
          label: "LMS",
          url: "#",
          subLinks: [
            {
              label: "Portal Dosen",
              url: "https://sttpu.dosen.lms.civitas.id/",
            },
            {
              label: "Portal Mahasiswa",
              url: "https://sttpu.lms.civitas.id/",
            },
            {
              label: "Panduan LMS",
              url: "#",
              subLinks: [
                {
                  label: "Panduan Dosen",
                  url: "https://www.youtube.com/playlist?list=PLdgvBqqJqMZ9N_sqJoxvLQSWWZGYjUHbv",
                },
                {
                  label: "Panduan Mahasiswa",
                  url: "https://www.youtube.com/playlist?list=PLdgvBqqJqMZ-bAzNjP9KYE3u-1R_m_u0v",
                },
              ],
            },
          ],
        },
        { label: "Pengajuan", url: "#" },
      ],
    },
    {
      label: "Program Studi",
      url: "/prodi",
      subLinks: [
        { label: "Teknik Sipil", url: "/prodi/teknik-sipil" },
        { label: "Teknik Lingkungan", url: "/prodi/teknik-lingkungan" },
        { label: "Teknik Informatika", url: "/prodi/teknik-informatika" },
      ],
    },
    {
      label: "LPPM",
      url: "/lppm",
      subLinks: [
        { label: "PKM", url: "/lppm/pkm" },
        { label: "Publikasi", url: "/lppm/publikasi" },
        { label: "Laporan", url: "/lppm/laporan" },
      ],
    },
    {
      label: "LPMI",
      url: "/lpmi",
      subLinks: [{ label: "Segera Hadir", url: "#" }],
    },
    {
      label: "Fasilitas",
      url: "/fasilitas",
      subLinks: [
        { label: "Laboratorium", url: "/fasilitas/laboratorium" },
        { label: "Perpustakaan", url: "/fasilitas/perpustakaan" },
        { label: "Masjid", url: "/fasilitas/masjid" },
        { label: "Kantin", url: "/fasilitas/kantin" },
        { label: "Lainnya", url: "/fasilitas/lainnya" },
      ],
    },
    {
      label: "Berita",
      url: "/berita",
      subLinks: [
        { label: "Kegiatan", url: "/berita/kegiatan" },
        { label: "Akademik", url: "/berita/akademik" },
        { label: "Pengumuman", url: "/berita/pengumuman" },
        { label: "Lainnya", url: "/berita/lainnya" },
      ],
    },
    {
      label: "Download",
      url: "/download",
      subLinks: [
        { label: "Kalender Akademik", url: "/download/kalender-akademik" },
        { label: "Formulir", url: "/download/formulir" },
        { label: "Pedoman Akademik", url: "/download/pedoman-akademik" },
        {
          label: "Pedoman Kemahasiswaan",
          url: "/download/pedoman-kemahasiswaan",
        },
      ],
    },
    {
      label: "PMB 2026",
      url: "https://sttsaptataruna.pmbonline.siakad.tech/",
      is_highlighted: true,
    },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass py-3 shadow-lg" : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center group">
          <div className="relative w-28 h-10 md:w-44 md:h-14 transition-transform group-hover:scale-105">
            <Image
              src="/assets/sttpu-landscape.png"
              alt={globalConfig.site_name || "STTPU Logo"}
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group/main">
              <Link
                href={link.url}
                target={link.url.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.url.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className={cn(
                  "text-sm font-bold tracking-tight transition-all flex items-center gap-1",
                  link.is_highlighted
                    ? "bg-secondary text-primary px-6 py-2 rounded-full hover:bg-white shadow-xl shadow-secondary/20"
                    : scrolled
                      ? "text-primary hover:text-secondary"
                      : "text-white hover:text-white/80",
                )}
              >
                {link.label}
                {link.subLinks && (
                  <ChevronDown className="w-4 h-4 transition-transform group-hover/main:rotate-180" />
                )}
              </Link>

              {link.subLinks && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible translate-y-2 group-hover/main:opacity-100 group-hover/main:visible group-hover/main:translate-y-0 transition-all duration-300 z-50">
                  <DesktopSubMenu items={link.subLinks} level={1} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className={scrolled ? "text-foreground" : "text-white"} />
          ) : (
            <Menu className={scrolled ? "text-foreground" : "text-white"} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass border-t border-border animate-fade-in-up">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <MobileSubMenu
                key={link.label}
                item={link}
                level={0}
                activePaths={activeMobilePaths}
                onToggle={toggleMobileSub}
                onClose={() => setIsOpen(false)}
              />
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

function DesktopSubMenu({
  items,
  level,
}: {
  items: NavLinkItem[];
  level: number;
}) {
  const groupNames = [
    "group/sub-0",
    "group/sub-1",
    "group/sub-2",
    "group/sub-3",
    "group/sub-4",
    "group/sub-5",
  ];
  const hoverClasses = [
    "group-hover/sub-0:opacity-100 group-hover/sub-0:visible group-hover/sub-0:translate-x-0",
    "group-hover/sub-1:opacity-100 group-hover/sub-1:visible group-hover/sub-1:translate-x-0",
    "group-hover/sub-2:opacity-100 group-hover/sub-2:visible group-hover/sub-2:translate-x-0",
    "group-hover/sub-3:opacity-100 group-hover/sub-3:visible group-hover/sub-3:translate-x-0",
    "group-hover/sub-4:opacity-100 group-hover/sub-4:visible group-hover/sub-4:translate-x-0",
    "group-hover/sub-5:opacity-100 group-hover/sub-5:visible group-hover/sub-5:translate-x-0",
  ];

  return (
    <div
      className={cn(
        "bg-white/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl min-w-[220px] p-2",
        level > 1
          ? cn(
              "absolute left-full top-0 ml-2 opacity-0 invisible translate-x-2 transition-all duration-300",
              hoverClasses[level - 1],
            )
          : "",
      )}
    >
      {items.map((sub) => (
        <div key={sub.label} className={cn("relative", groupNames[level])}>
          <Link
            href={sub.url}
            target={sub.url.startsWith("http") ? "_blank" : undefined}
            rel={sub.url.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center justify-between px-4 py-3 text-sm font-bold text-primary hover:bg-primary/5 hover:text-secondary rounded-xl transition-all"
          >
            {sub.label}
            {sub.subLinks && <ChevronRight className="w-4 h-4" />}
          </Link>
          {sub.subLinks && (
            <DesktopSubMenu items={sub.subLinks} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
}

function MobileSubMenu({
  item,
  level,
  activePaths,
  onToggle,
  onClose,
}: {
  item: NavLinkItem;
  level: number;
  activePaths: string[];
  onToggle: (label: string, level: number) => void;
  onClose: () => void;
}) {
  const isActive = activePaths[level] === item.label;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <Link
          href={item.url}
          target={item.url.startsWith("http") ? "_blank" : undefined}
          rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
          className={cn(
            level === 0
              ? "text-lg font-semibold py-2 grow"
              : "text-base font-medium py-2 text-muted-foreground hover:text-primary transition-colors grow",
            item.is_highlighted ? "text-secondary" : "",
          )}
          onClick={() => {
            if (!item.subLinks) onClose();
          }}
        >
          {item.label}
        </Link>
        {item.subLinks && (
          <button onClick={() => onToggle(item.label, level)} className="p-2">
            <ChevronDown
              className={cn(
                "transition-transform text-muted-foreground",
                level === 0 ? "w-5 h-5" : "w-4 h-4",
                isActive ? "rotate-180" : "",
              )}
            />
          </button>
        )}
      </div>
      {item.subLinks && isActive && (
        <div
          className={cn(
            "flex flex-col pl-4 border-l-2 border-primary/10 mb-2 mt-1 gap-1 animate-fade-in",
            level > 0 && "border-l border-primary/10 ml-2",
          )}
        >
          {item.subLinks.map((sub) => (
            <MobileSubMenu
              key={sub.label}
              item={sub}
              level={level + 1}
              activePaths={activePaths}
              onToggle={onToggle}
              onClose={onClose}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Hero({
  headline,
  subheadline,
  ctaLabel,
  ctaUrl,
}: {
  headline: string;
  subheadline?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out", duration: 1 },
      });

      tl.from(".hero-badge", { opacity: 0, y: 30, duration: 0.8 })
        .from(".hero-title", { opacity: 0, y: 40, stagger: 0.2 }, "-=0.4")
        .from(".hero-desc", { opacity: 0, y: 20 }, "-=0.6")
        .from(".hero-btns", { opacity: 0, scale: 0.9, duration: 0.8 }, "-=0.6")
        .from(".hero-visual", { opacity: 0, x: 50, duration: 1.2 }, "-=1");
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden"
    >
      {/* Background with Grid & Gradient */}
      <div className="absolute inset-0 blueprint-grid opacity-20 z-0" />
      <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-background z-[-1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.4),transparent_50%)] z-0" />

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-secondary text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
            <GraduationCap size={14} />
            Penerimaan Mahasiswa Baru 2026
          </div>
          <h1 className="hero-title text-4xl md:text-8xl font-black text-white leading-none mb-8 tracking-tighter text-balance">
            {headline}
          </h1>
          <p className="hero-desc text-base md:text-lg text-white/70 mb-10 max-w-lg leading-relaxed font-medium">
            {subheadline}
          </p>
          <div className="hero-btns flex flex-col sm:flex-row gap-5">
            <Link
              href={ctaUrl || "#"}
              className="bg-secondary text-primary-foreground px-10 py-4 md:py-5 rounded-full font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-secondary/20 flex items-center justify-center gap-2"
            >
              {ctaLabel || "Daftar Sekarang"}
            </Link>
            <Link
              href="/akademik"
              className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-4 md:py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-all text-center"
            >
              Program Studi
            </Link>
          </div>
        </div>

        {/* Premium Visual Composition */}
        <div className="hero-visual relative aspect-square group">
          <div className="absolute inset-0 bg-secondary/5 rounded-[4rem] rotate-3 scale-105 blur-2xl group-hover:rotate-6 transition-transform duration-700" />
          <div className="relative h-full w-full rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
            <Image
              src="/assets/hero-premium.png"
              alt="STTPU Campus Architecture"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function FacultyCard({ faculty }: { faculty: WithId<Faculty> }) {
  const getFacultyImage = (slug: string | null | undefined) => {
    if (!slug) return "/assets/faculty-informatics.png";
    if (slug.includes("sipil")) return "/assets/faculty-civil.png";
    if (slug.includes("lingkungan") || slug.includes("air"))
      return "/assets/faculty-environment.png";
    return "/assets/faculty-informatics.png";
  };

  return (
    <div className="faculty-card group relative bg-card/50 backdrop-blur-sm p-8 rounded-[2.5rem] border border-border/50 hover:border-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/5 overflow-hidden flex flex-col h-full">
      <div className="relative aspect-16/10 mb-8 rounded-2xl overflow-hidden border border-border/10">
        <Image
          src={getFacultyImage(faculty.slug)}
          alt={faculty.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/40 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col grow">
        <h3 className="text-3xl font-black mb-4 tracking-tighter leading-tight group-hover:text-primary transition-colors">
          {faculty.name}
        </h3>
        <p className="text-muted-foreground line-clamp-2 mb-8 text-sm leading-relaxed">
          {faculty.description}
        </p>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-8">
            {faculty.majors?.slice(0, 2).map((major) => (
              <span
                key={major.id}
                className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-muted/50 rounded-full border border-border/50"
              >
                {major.degree} — {major.name}
              </span>
            ))}
          </div>

          <Link
            href={`/fakultas/${faculty.slug}`}
            className="flex items-center justify-between w-full p-4 rounded-2xl bg-muted/30 group-hover:bg-primary group-hover:text-white transition-all font-bold text-sm"
          >
            Pelajari Kurikulum
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function NewsCard({ news }: { news: WithId<News> }) {
  return (
    <Link
      href={`/berita/${news.slug}`}
      className="news-card group flex flex-col bg-card/30 backdrop-blur-xs rounded-4xl border border-border/40 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all h-full"
    >
      <div className="relative aspect-video overflow-hidden bg-muted/20">
        {news.featured_image ? (
          <Image
            src={getStrapiMedia(news.featured_image.url) || ""}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
            <Image
              className="opacity-5"
              src="/next.svg"
              width={100}
              height={20}
              alt="placeholder"
            />
          </div>
        )}
        <div className="absolute top-6 left-6 flex gap-2">
          {news.categories?.slice(0, 1).map((cat) => (
            <span
              key={cat.id}
              className="bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10"
            >
              {cat.name}
            </span>
          ))}
        </div>
      </div>
      <div className="p-8 flex flex-col grow">
        <span className="text-[10px] text-muted-foreground mb-4 font-black uppercase tracking-widest">
          {new Date(news.publishedAt || news.createdAt).toLocaleDateString(
            "id-ID",
            { day: "numeric", month: "long", year: "numeric" },
          )}
        </span>
        <h3 className="text-2xl font-black mb-6 line-clamp-2 group-hover:text-primary transition-colors leading-tight tracking-tight">
          {news.title}
        </h3>
        <div className="mt-auto flex items-center justify-between py-4 border-t border-border/10">
          <span className="text-primary font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all flex items-center gap-2">
            Baca Artikel
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function EventCard({ event }: { event: WithId<Event> }) {
  const startDate = new Date(event.date_start);
  return (
    <div className="flex bg-card p-6 rounded-2xl border border-border hover:shadow-lg transition-all gap-6 items-start">
      <div className="flex flex-col items-center justify-center bg-primary text-white w-20 h-20 rounded-xl shrink-0">
        <span className="text-2xl font-black leading-none">
          {startDate.getDate()}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-widest">
          {startDate.toLocaleDateString("id-ID", { month: "short" })}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {event.categories?.map((cat) => (
            <span
              key={cat.id}
              className="text-[9px] font-bold text-secondary uppercase tracking-widest px-2 py-0.5 border border-secondary/20 rounded-md"
            >
              {cat.name}
            </span>
          ))}
        </div>
        <h4 className="text-lg font-bold leading-tight hover:text-primary cursor-pointer transition-colors">
          {event.title}
        </h4>
        <div className="flex items-center gap-2 text-muted-foreground text-xs mt-1">
          <MapPin size={14} className="text-secondary" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
      </div>
    </div>
  );
}

export function StatsSection() {
  const stats: { label: string; value: string; icon: LucideIcon }[] = [
    { label: "Mahasiswa Aktif", value: "2,500+", icon: GraduationCap },
    { label: "Alumni Terserap", value: "98%", icon: HardHat },
    { label: "Program Studi", value: "11", icon: Menu },
    { label: "Laboratorium", value: "25", icon: MapPin },
  ];

  return (
    <div className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 border border-border/30 rounded-3xl md:rounded-[3rem] p-6 md:p-12 bg-white/5 backdrop-blur-xl shadow-2xl">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center group border-r border-border/10 last:border-0"
            >
              <div className="text-2xl md:text-4xl font-black text-primary mb-2 tracking-tighter group-hover:scale-110 transition-transform inline-block">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Footer({
  globalConfig,
}: {
  globalConfig: WithId<GlobalConfig>;
}) {
  return (
    <footer className="bg-primary text-white pt-20 pb-10 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-secondary" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shadow-xl">
                <Image
                  src="/assets/sttpu-portrait.png"
                  alt="STTPU Foot Logo"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div>
                <h2 className="text-3xl font-black leading-none tracking-tighter">
                  {globalConfig.site_name || "STT Pekerjaan Umum"}
                </h2>
                <p className="text-xs text-white/60 uppercase tracking-widest mt-1 font-bold">
                  Jakarta
                </p>
              </div>
            </div>
            <p className="text-white/70 max-w-md leading-relaxed mb-8">
              STT Pekerjaan Umum dibawah Yayasan Pendidikan Putra, Lembaga
              pendidikan teknik yang berfokus pada pengembangan sumber daya
              manusia unggul di bidang infrastruktur dan pekerjaan umum.
            </p>
            <div className="flex flex-col gap-4">
              {globalConfig.address_text && (
                <div className="flex items-start gap-3">
                  <MapPin className="text-secondary shrink-0" size={20} />
                  <span className="text-sm text-white/80">
                    {globalConfig.address_text}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Phone className="text-secondary shrink-0" size={20} />
                <span className="text-sm text-white/80">
                  02138851092 - 02138851109
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-2">
              Navigasi
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <Link
                  href="/profil"
                  className="text-white/60 hover:text-secondary transition-colors text-sm"
                >
                  Profil Kampus
                </Link>
              </li>
              <li>
                <Link
                  href="/akademik"
                  className="text-white/60 hover:text-secondary transition-colors text-sm"
                >
                  Program Studi
                </Link>
              </li>
              <li>
                <Link
                  href="/fasilitas"
                  className="text-white/60 hover:text-secondary transition-colors text-sm"
                >
                  Fasilitas
                </Link>
              </li>
              <li>
                <Link
                  href="/perpustakaan"
                  className="text-white/60 hover:text-secondary transition-colors text-sm"
                >
                  Perpustakaan
                </Link>
              </li>
              <li>
                <Link
                  href="/kerjasama"
                  className="text-white/60 hover:text-secondary transition-colors text-sm"
                >
                  Kerjasama
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-2">
              Sosial Media
            </h3>
            <ul className="flex flex-col gap-3">
              {globalConfig.social_links?.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-secondary transition-colors text-sm flex items-center gap-2"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} {globalConfig.site_name}. All Rights
            Reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-white/40 hover:text-white text-xs transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="/terms"
              className="text-white/40 hover:text-white text-xs transition-colors"
            >
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
