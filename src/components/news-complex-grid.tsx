"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Calendar, Newspaper } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { News, WithId } from "@/app/lib/cms-types";
import { getMediaUrl } from "@/app/lib/cms-utils";

// Pastikan untuk mendaftarkan ScrollTrigger agar Next.js tidak kehilangan orientasi
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function NewsComplexGrid({ news }: { news: WithId<News>[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const elements = gsap.utils.toArray(".bento-item");
      
      gsap.from(elements, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: containerRef }
  );

  if (!news || news.length === 0) return null;

  // Bentuk Bento Grid: 1 Berita Besar (Kiri), 3 Berita Sedang (Kanan)
  const primaryNews = news[0];
  const secondaryData = news.slice(1, 4);

  return (
    <section
      className="py-24 bg-background relative overflow-hidden"
      ref={containerRef}
    >
      {/* Orbs Biru Halus Khas Kampus */}
      <div className="absolute inset-0 blueprint-grid opacity-[0.03] pointer-events-none -z-10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        {/* Header Teks */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 bento-item">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-4">
              <Newspaper size={16} />
              Berita & Publikasi Terkini
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance">
              Sorotan Utama STTPU
            </h2>
          </div>
          <Link
            href="/berita"
            className="group flex items-center gap-2 font-bold text-primary hover:gap-3 transition-all"
          >
            Semua Berita Terbaru{" "}
            <ArrowUpRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* CSS GRID BENTO BOX */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
          
          {/* GRID KIRI: MAIN FEATURE (7 Kolom) */}
          {primaryNews && (
            <Link
              href={`/berita/${primaryNews.slug}`}
              className="bento-item shadow-[0_10px_40px_rgba(0,0,0,0.1)] block relative group overflow-hidden rounded-3xl lg:col-span-7 bg-muted"
            >
              <div className="absolute inset-0 -z-10 bg-[#041a2f]" />
              {primaryNews.featured_image && (
                <Image
                  src={
                    primaryNews.featured_image.url.startsWith("http")
                      ? primaryNews.featured_image.url
                      : getMediaUrl(primaryNews.featured_image) || "/assets/hero-premium.png"
                  }
                  alt={primaryNews.title || "Primary News Image"}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-[1.03] -z-20 opacity-80 group-hover:opacity-100 mix-blend-luminosity"
                />
              )}

              {/* Lapisan Gradient Klasik Modern */}
              <div className="absolute inset-0 bg-linear-to-t from-[#041a2f] via-primary/60 to-transparent pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 flex flex-col justify-end text-white">
                {/* Lencana Kategori */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {primaryNews.categories?.map((cat) => (
                    <span
                      key={cat.id}
                      className="px-3 py-1 rounded-full text-xs font-bold shadow-md backdrop-blur-md border border-white/20 text-white truncate max-w-[150px]"
                      style={{
                        backgroundColor: cat.color_code
                          ? `${cat.color_code}cc`
                          : "rgba(10, 78, 154, 0.8)",
                      }}
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>

                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight group-hover:text-secondary transition-colors mb-6 line-clamp-3 text-balance drop-shadow-xl">
                  {primaryNews.title}
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white/80 text-sm font-semibold">
                    <Calendar size={16} />
                    <span>
                      {new Date(
                        primaryNews.publishedAt || primaryNews.createdAt || new Date().toISOString()
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  
                  {/* Animasi Panah Muncul */}
                  <div className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center -translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl shadow-secondary/20">
                    <ArrowUpRight size={24} />
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* GRID KANAN: 3 ITEM VERTIKAL (5 Kolom) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {secondaryData.map((item) => (
              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                className="bento-item min-h-[140px] flex-1 flex flex-col sm:flex-row bg-card border border-border rounded-3xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Thumbnail Gambar Kotak */}
                <div className="relative w-full sm:w-[200px] h-[200px] sm:h-auto shrink-0 bg-muted">
                  {item.featured_image && (
                    <Image
                      src={
                        item.featured_image.url.startsWith("http")
                          ? item.featured_image.url
                          : getMediaUrl(item.featured_image) || "/assets/hero-premium.png"
                      }
                      alt={item.title || "News Image"}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  )}
                  {/* Overlay gradien halus */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors pointer-events-none mix-blend-overlay" />
                </div>

                {/* Teks Konten */}
                <div className="flex flex-col p-6 flex-1 justify-center">
                  <div className="flex gap-2 mb-3">
                    {item.categories?.slice(0, 1).map((cat) => (
                      <span
                        key={cat.id}
                        className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded backdrop-blur-sm bg-muted/50"
                        style={{ color: cat.color_code || "#0A4E9A" }}
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2 md:line-clamp-3 mb-4">
                    {item.title}
                  </h3>

                  <div className="mt-auto text-muted-foreground text-xs font-bold flex items-center justify-between">
                    <div className="flex gap-1.5 items-center">
                      <Calendar size={13} />
                      {new Date(
                        item.publishedAt || item.createdAt || new Date().toISOString()
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    
                    <ArrowUpRight size={16} className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
