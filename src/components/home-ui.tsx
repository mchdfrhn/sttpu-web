"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, HardHat, GraduationCap, MapPin, Phone, ArrowRight, LucideIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Faculty, News, Event, GlobalConfig, getStrapiMedia, WithId } from "@/app/lib/strapi";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "/" },
    { label: "Tentang", href: "/tentang" },
    { label: "Akademik", href: "/akademik" },
    { label: "Program Studi", href: "/prodi" },
    { label: "LPPM", href: "/lppm" },
    { label: "LPMI", href: "/lpmi" },
    { label: "Fasilitas", href: "/fasilitas" },
    { label: "Berita", href: "/berita" },
    { label: "Download", href: "/download"},
    { label: "PMB 2026", href: "/pmb", highlighted: true },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass py-3 shadow-lg" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 md:w-16 md:h-16 transition-transform group-hover:scale-105">
            <Image 
              src="/assets/sttpu-portrait.png" 
              alt="STTPU Logo" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "font-black text-xl md:text-2xl tracking-tighter leading-none transition-colors",
              !scrolled ? "text-white drop-shadow-md" : "text-primary"
            )}>
              STTPU
            </span>
            <span className={cn(
              "text-[10px] uppercase tracking-[0.2em] font-bold mt-1",
              !scrolled ? "text-white/80" : "text-primary/60"
            )}>
              Jakarta
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-secondary",
                link.highlighted 
                  ? "bg-secondary text-white px-5 py-2 rounded-full hover:bg-secondary/90 shadow-md" 
                  : scrolled ? "text-foreground" : "text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className={scrolled ? "text-foreground" : "text-white"} /> : <Menu className={scrolled ? "text-foreground" : "text-white"} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass border-t border-border animate-fade-in-up">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-lg font-semibold py-2",
                  link.highlighted ? "text-secondary" : "text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export function Hero({ headline, subheadline, ctaLabel, ctaUrl }: { 
  headline: string; 
  subheadline?: string | null; 
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });
    
    tl.from(".hero-badge", { opacity: 0, y: 30, duration: 0.8 })
      .from(".hero-title", { opacity: 0, y: 40, stagger: 0.2 }, "-=0.4")
      .from(".hero-desc", { opacity: 0, y: 20 }, "-=0.6")
      .from(".hero-btns", { opacity: 0, scale: 0.9, duration: 0.8 }, "-=0.6")
      .from(".hero-visual", { opacity: 0, x: 50, duration: 1.2 }, "-=1");
  }, { scope: container });

  return (
    <section ref={container} className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
      {/* Background with Grid & Gradient */}
      <div className="absolute inset-0 blueprint-grid opacity-30 z-0" />
      <div className="absolute inset-0 bg-linear-to-br from-primary via-primary/95 to-background z-[-1]" />
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />

      <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="hero-badge inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-sm font-bold uppercase tracking-wider mb-6">
            <GraduationCap size={16} />
            Penerimaan Mahasiswa Baru 2026
          </div>
          <h1 className="hero-title text-5xl md:text-7xl font-extrabold text-white leading-[1.1] mb-6 drop-shadow-sm text-balance">
            {headline}
          </h1>
          <p className="hero-desc text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
            {subheadline}
          </p>
          <div className="hero-btns flex flex-wrap gap-4">
            <Link
              href={ctaUrl || "#"}
              className="bg-secondary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-secondary/90 transition-all hover:scale-105 shadow-xl shadow-secondary/20 flex items-center gap-2"
            >
              {ctaLabel || "Daftar Sekarang"}
            </Link>
            <Link
              href="/akademik"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
            >
              Lihat Program Studi
            </Link>
          </div>
        </div>
        
        {/* Placeholder for Hero Image/Graphic */}
        <div className="hero-visual relative aspect-video md:aspect-square bg-slate-800/50 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="text-center p-8">
               <HardHat size={80} className="text-secondary/40 mx-auto mb-4" />
               <p className="text-white/40 font-mono text-sm tracking-widest uppercase">STTPU Interior Showcase</p>
             </div>
          </div>
          {/* We'll use actual content once we fetch it */}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}

export function FacultyCard({ faculty }: { faculty: WithId<Faculty> }) {
  return (
    <div className="faculty-card group relative bg-card p-8 rounded-3xl border border-border hover:border-primary/50 transition-all hover:shadow-2xl overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
      
      <div className="relative z-10">
        <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <GraduationCap size={28} />
        </div>
        <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{faculty.name}</h3>
        <p className="text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
          {faculty.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {faculty.majors?.map((major) => (
            <span key={major.id} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-muted rounded">
              {major.degree} {major.name}
            </span>
          ))}
        </div>

        <Link 
          href={`/fakultas/${faculty.slug}`} 
          className="inline-flex items-center gap-2 font-bold text-primary group-hover:gap-3 transition-all"
        >
          Selengkapnya
          <ArrowRight className="w-4 h-4" /> 
        </Link>
      </div>
    </div>
  );
}

export function NewsCard({ news }: { news: WithId<News> }) {
  return (
    <Link href={`/berita/${news.slug}`} className="news-card group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all h-full">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {news.featured_image ? (
          <Image 
            src={getStrapiMedia(news.featured_image.url) || ""} 
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
             <Image className="opacity-10" src="/next.svg" width={100} height={20} alt="placeholder" />
          </div>
        )}
        <div className="absolute top-4 left-4 flex gap-2">
          {news.categories?.slice(0, 1).map((cat) => (
            <span key={cat.id} className="bg-primary/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full backdrop-blur-md">
              {cat.name}
            </span>
          ))}
        </div>
      </div>
      <div className="p-6 flex flex-col grow">
        <span className="text-xs text-muted-foreground mb-3 font-medium">
          {new Date(news.publishedAt || news.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
        </span>
        <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {news.title}
        </h3>
        <div className="mt-auto flex items-center gap-2 text-primary font-bold text-sm">
          Baca Artikel
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
        <span className="text-2xl font-black leading-none">{startDate.getDate()}</span>
        <span className="text-[10px] uppercase font-bold tracking-widest">{startDate.toLocaleDateString("id-ID", { month: 'short' })}</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {event.categories?.map((cat) => (
            <span key={cat.id} className="text-[9px] font-bold text-secondary uppercase tracking-widest px-2 py-0.5 border border-secondary/20 rounded-md">
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
    <div className="bg-primary py-12">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="text-center group">
            <stat.icon className="mx-auto text-secondary mb-4 group-hover:scale-110 transition-transform" size={32} />
            <div className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</div>
            <div className="text-white/60 text-xs uppercase tracking-[0.2em] font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Footer({ globalConfig }: { globalConfig: WithId<GlobalConfig> }) {
  return (
    <footer className="bg-primary text-white pt-20 pb-10 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-secondary" />
      
      <div className="container mx-auto px-6">
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
                <h2 className="text-3xl font-black leading-none tracking-tighter">STTPU</h2>
                <p className="text-xs text-white/60 uppercase tracking-widest mt-1 font-bold">Jakarta</p>
              </div>
            </div>
            <p className="text-white/70 max-w-md leading-relaxed mb-8">
              Lembaga pendidikan teknik vokasional yang berfokus pada pengembangan sumber daya manusia unggul di bidang infrastruktur dan pekerjaan umum.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-secondary shrink-0" size={20} />
                <span className="text-sm text-white/80">{globalConfig.address_text}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-secondary shrink-0" size={20} />
                <span className="text-sm text-white/80">+62 (21) 1234-5678</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-2">Navigasi</h3>
            <ul className="flex flex-col gap-3">
              <li><Link href="/profil" className="text-white/60 hover:text-secondary transition-colors text-sm">Profil Kampus</Link></li>
              <li><Link href="/akademik" className="text-white/60 hover:text-secondary transition-colors text-sm">Program Studi</Link></li>
              <li><Link href="/fasilitas" className="text-white/60 hover:text-secondary transition-colors text-sm">Fasilitas</Link></li>
              <li><Link href="/perpustakaan" className="text-white/60 hover:text-secondary transition-colors text-sm">Perpustakaan</Link></li>
              <li><Link href="/kerjasama" className="text-white/60 hover:text-secondary transition-colors text-sm">Kerjasama</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 border-b border-white/10 pb-2">Sosial Media</h3>
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
            © {new Date().getFullYear()} {globalConfig.site_name}. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/40 hover:text-white text-xs transition-colors">Kebijakan Privasi</Link>
            <Link href="/terms" className="text-white/40 hover:text-white text-xs transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
