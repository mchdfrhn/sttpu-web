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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  Faculty,
  News,
  Event,
  GlobalConfig,
  getStrapiMedia,
  WithId,
  NavigationMenu,
  StatItem,
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
  navItems = [],
}: {
  globalConfig: WithId<GlobalConfig>;
  navItems?: NavigationMenu[];
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

  const navLinks: NavLinkItem[] = navItems.length > 0 ? navItems.map((item) => ({
    label: item.label,
    url: item.url,
    is_highlighted: item.is_highlighted,
    subLinks: item.children && item.children.length > 0 ? item.children.map(child => ({
      label: child.label,
      url: child.url,
      subLinks: child.children && child.children.length > 0 ? child.children.map(subChild => ({
        label: subChild.label,
        url: subChild.url,
      })) : undefined,
    })) : undefined,
  })) : [
    { label: "Beranda", url: "/" }
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-100 transition-all duration-300",
        scrolled ? "bg-white/60 backdrop-blur-2xl py-3 shadow-lg" : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center group"
          onClick={(e) => {
            if (window.location.pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
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
                onClick={(e) => {
                  if (link.url === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
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

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-white/60 backdrop-blur-2xl z-100 transition-all duration-500 ease-in-out md:hidden flex flex-col",
          isOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none",
        )}
      >
        {/* Mobile Header (Ultra-Transparent Glass) */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-transparent sticky top-0 z-10">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center">
            <div className="relative w-28 h-10">
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
          <button
            className="p-2 hover:bg-muted rounded-full transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X size={28} className="text-primary" />
          </button>
        </div>

        {/* Mobile Menu Items */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="flex flex-col gap-2">
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

        {/* Mobile Footer/Action Section (Optional) */}
        <div className="p-6 border-t border-border bg-muted/20">
          <Link
            href="/pmb"
            onClick={() => setIsOpen(false)}
            className="block w-full text-center bg-secondary text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-secondary/20 active:scale-95 transition-transform"
          >
            Daftar PMB 2026
          </Link>
        </div>
      </div>
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
      <div className="flex items-center justify-between group">
        <Link
          href={item.url}
          target={item.url.startsWith("http") ? "_blank" : undefined}
          rel={item.url.startsWith("http") ? "noopener noreferrer" : undefined}
          className={cn(
            "transition-all duration-300 grow",
            level === 0
              ? "text-xl font-extrabold py-3 text-primary tracking-tight"
              : "text-base font-medium py-2 text-muted-foreground hover:text-primary pl-2",
            item.is_highlighted ? "text-secondary" : "",
            isActive && level === 0 ? "text-secondary" : "",
          )}
          onClick={() => {
            if (item.url === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
            if (!item.subLinks) onClose();
          }}
        >
          {item.label}
        </Link>
        {item.subLinks && (
          <button
            onClick={() => onToggle(item.label, level)}
            className={cn(
              "p-3 rounded-xl transition-all",
              isActive ? "bg-primary/5" : "hover:bg-muted",
            )}
          >
            <ChevronDown
              className={cn(
                "transition-transform duration-500",
                level === 0 ? "w-6 h-6 text-primary" : "w-5 h-5 text-muted-foreground",
                isActive ? "rotate-180 text-secondary" : "",
              )}
            />
          </button>
        )}
      </div>
      {item.subLinks && isActive && (
        <div
          className={cn(
            "flex flex-col mb-2 mt-1 gap-1 overflow-hidden",
            level === 0 ? "pl-4 border-l-2 border-secondary/20 ml-2" : "pl-6 border-l border-border ml-4",
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
  news = [],
}: {
  headline: string;
  subheadline?: string | null;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  news?: WithId<News>[];
}) {
  const container = useRef<HTMLDivElement>(null);
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrentIndex(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

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
    { scope: container }
  );

  // Combine static hero with news highlights
  const slides = [
    {
      type: "static",
      title: headline,
      desc: subheadline,
      label: ctaLabel || "Daftar Sekarang",
      url: ctaUrl || "#",
      image: "/assets/hero-premium.png",
      date: "Penerimaan Mahasiswa Baru 2026",
      category: "Info Utama"
    },
    ...news.map((item) => ({
      type: "news",
      title: item.title,
      desc: "Simak berita terbaru seputar STT Pekerjaan Umum langsung dari kanal informasi kami.",
      label: "Selengkapnya",
      url: `/berita/${item.slug}`,
      image: getStrapiMedia(item.featured_image?.url) || "/assets/hero-premium.png",
      date: new Date(item.publishedAt || item.createdAt).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
      }),
      category: item.categories && item.categories.length > 0 ? item.categories[0].name : "Kabar Kampus"
    })),
  ];

  return (
    <section ref={container} className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden outline-none bg-background">
      {/* 1. Original dark blue gradient base */}
      <div className="absolute inset-0 bg-linear-to-br from-primary via-[#0b3b60] to-background z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-secondary/10 via-transparent to-transparent z-0" />

      {/* 2. Transparent fain image overlay (watermark effect) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none transition-all duration-1000">
        {slides.map((slide, i) => (
          <Image
            key={i}
            src={slide.image}
            fill
            alt="bg"
            className={cn(
              "object-cover transition-opacity duration-1000 mix-blend-luminosity",
              currentIndex === i ? "opacity-15" : "opacity-0"
            )}
          />
        ))}
        {/* Soften the image bottom into the background */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/20 to-background/90" />
      </div>

      {/* 3. Blueprint Grid & Radial Light Restores */}
      <div className="absolute inset-0 blueprint-grid opacity-15 z-0 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.08),transparent_40%)] z-0 pointer-events-none" />

      {/* Decorative Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse pointer-events-none" data-scroll data-scroll-speed="0.05" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none" data-scroll data-scroll-speed="-0.05" />

      <Carousel
        setApi={setApi}
        plugins={[Autoplay({ delay: 6000, stopOnInteraction: true })]}
        opts={{ loop: true }}
        className="w-full relative z-10 group/hero"
      >
        
        <CarouselContent className="relative z-10">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="basis-full">
              <div className="container mx-auto px-4 md:px-6 relative z-10 grid md:grid-cols-2 gap-12 md:gap-16 items-center w-full min-h-[70vh] py-12">
                <div data-scroll data-scroll-speed="0.1">
                  <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-secondary text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-sm">
                    {slide.type === "static" ? <GraduationCap size={14} /> : <ArrowRight size={14} />}
                    {slide.date}
                  </div>
                  <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white leading-tight mb-8 tracking-tighter text-balance">
                    {slide.title}
                  </h1>
                  <p className="hero-desc text-base md:text-lg text-white/70 mb-10 max-w-lg leading-relaxed font-medium line-clamp-3">
                    {slide.desc}
                  </p>
                  <div className="hero-btns flex flex-col sm:flex-row gap-5">
                    <Link
                      href={slide.url}
                      className="bg-secondary text-primary-foreground px-10 py-4 md:py-5 rounded-full font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-secondary/20 flex items-center justify-center gap-2"
                    >
                      {slide.label}
                    </Link>
                    {slide.type === "static" && (
                      <Link
                        href="/akademik"
                        className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-4 md:py-5 rounded-full font-bold text-lg hover:bg-white/10 transition-all text-center"
                      >
                        Program Studi
                      </Link>
                    )}
                  </div>
                </div>

                {/* Premium Visual Composition */}
                <div className="hero-visual relative aspect-square group w-full" data-scroll data-scroll-speed="-0.05">
                  <div className="absolute inset-0 bg-secondary/5 rounded-4xl sm:rounded-[4rem] rotate-3 scale-105 blur-2xl group-hover:rotate-6 transition-transform duration-700" />
                  <div className="relative h-full w-full rounded-4xl sm:rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-110"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-primary/60 via-transparent to-transparent opacity-80" />
                    
                    {slide.type === "news" && (
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="px-4 py-2 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 inline-block">
                           <p className="text-secondary font-bold text-sm">{slide.category}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="absolute inset-y-0 left-4 md:left-8 lg:left-12 flex items-center z-50 pointer-events-none">
          <CarouselPrevious className="relative translate-x-0 translate-y-0 left-0 right-0 top-0 bottom-0 pointer-events-auto bg-white/10 hover:bg-white/20 hover:text-white text-white border-white/20 h-14 w-14 rounded-full backdrop-blur-md opacity-0 group-hover/hero:opacity-100 transition-all duration-300 shadow-2xl hover:scale-110" />
        </div>
        
        <div className="absolute inset-y-0 right-4 md:right-8 lg:right-12 flex items-center z-50 pointer-events-none">
          <CarouselNext className="relative translate-x-0 translate-y-0 left-0 right-0 top-0 bottom-0 pointer-events-auto bg-white/10 hover:bg-white/20 hover:text-white text-white border-white/20 h-14 w-14 rounded-full backdrop-blur-md opacity-0 group-hover/hero:opacity-100 transition-all duration-300 shadow-2xl hover:scale-110" />
        </div>
      </Carousel>
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

export function StatsSection({ stats = [] }: { stats?: StatItem[] }) {
  const iconMap: Record<string, LucideIcon> = {
    GraduationCap,
    HardHat,
    Menu,
    MapPin,
    Phone,
    ArrowRight,
  };

  const getIcon = (name: string | null) => {
    if (!name) return Menu;
    return iconMap[name] || Menu;
  };

  const displayStats = stats.length > 0 ? stats.map(s => ({
    label: s.label,
    value: s.value,
    icon: getIcon(s.icon_name)
  })) : [
    { label: "Loading Data", value: "-", icon: Menu }
  ];

  return (
    <div className="py-16 md:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 border border-border/30 rounded-3xl md:rounded-[3rem] p-6 md:p-12 bg-white/5 backdrop-blur-xl shadow-2xl">
          {displayStats.map((stat, i) => (
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
    <footer className="relative text-white pt-20 pb-10 overflow-hidden bg-[#041a2f]">
      {/* 1. Underlying smooth dark blue gradient base */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0A4E9A] via-[#0b3b60] to-[#041a2f] z-0" />

      {/* 2. Transparent faint image overlay (watermark effect) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/assets/hero-premium.png"
          fill
          alt="Footer Background Texture"
          className="object-cover opacity-10 mix-blend-luminosity"
        />
        {/* Soften the image bottom into the dark base */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#041a2f]/90" />
      </div>

      {/* 3. Ambient Orbs & Grid (Smoothed out intensity) */}
      <div className="absolute inset-0 blueprint-grid opacity-10 pointer-events-none z-0" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute top-10 -left-20 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* 4. Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-secondary shadow-[0_0_30px_rgba(241,180,52,0.5)] z-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
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
              {globalConfig.contact?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="text-secondary shrink-0" size={20} />
                  <a href={`tel:${globalConfig.contact.phone.replace(/[\s-]/g, '')}`} className="text-sm text-white/80 hover:text-white transition-colors">
                    {globalConfig.contact.phone} {globalConfig.contact.whatsapp && `(WA: ${globalConfig.contact.whatsapp})`}
                  </a>
                </div>
              )}
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

        <div className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-6 shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
          <p className="text-white/70 text-sm font-medium">
            © {new Date().getFullYear()} {globalConfig.site_name}. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-white/60 hover:text-white text-sm font-semibold transition-colors"
            >
              Kebijakan Privasi
            </Link>
            <Link
              href="/terms"
              className="text-white/60 hover:text-white text-sm font-semibold transition-colors"
            >
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
