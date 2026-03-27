import {
  getHeroSection,
  getGlobalConfig,
  getFeaturedNews,
  getEvents,
  getAdmissionInfo,
} from "@/app/lib/strapi";
import {
  Navbar,
  Hero,
  NewsCard,
  EventCard,
  StatsSection,
  Footer,
} from "@/components/home-ui";
import { NewsComplexGrid } from "@/components/news-complex-grid";
import { HomeAnimations } from "@/components/home-animations";
import Link from "next/link";
import { ArrowRight, Calendar, Newspaper } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default async function Home() {
  // Fetch common data in parallel for performance (Next.js will handle deduplication and caching)
  const [heroRes, globalRes, newsRes, eventsRes, admissionRes] =
    await Promise.all([
      getHeroSection(),
      getGlobalConfig(),
      getFeaturedNews(6), // Fetch more for carousel
      getEvents({ pagination: { pageSize: 3 } }), // Limit to 3 events
      getAdmissionInfo(),
    ]);

  const hero = heroRes.data;
  const globalConfig = globalRes.data;
  const fetchedNews = newsRes.data;
  const upcomingEvents = eventsRes.data;
  const admission = admissionRes.data;

  // -- DUMMY DATA INJECTION --
  // Menyediakan data berita tiruan (dummy) agar tampilan website (Carousel & Card Berita)
  // terlihat penuh terisi meskipun database Strapi CMS masih kosong/sedikit.
  const dummyNews = [
    {
      id: 991,
      documentId: 'd-991',
      title: "Mahasiswa STTPU Berhasil Kembangkan Inovasi Beton Ramah Lingkungan",
      slug: "inovasi-beton-ramah-lingkungan",
      content: [],
      featured_image: { url: "https://images.unsplash.com/photo-1541888081182-ed17013ba041?q=80&w=1200", alternativeText: "Beton Ramah Lingkungan" },
      is_featured: true,
      categories: [{ id: 1, documentId: 'c1', name: "Akademik", slug: "akademik", color_code: "#10b981", createdAt: "", updatedAt: "", publishedAt: "", locale: "" }],
      createdAt: "2026-03-26T10:00:00.000Z",
      updatedAt: "2026-03-26T10:00:00.000Z",
      publishedAt: "2026-03-26T10:00:00.000Z",
      locale: "id",
    },
    {
      id: 992,
      documentId: 'd-992',
      title: "Kuliah Umum: Tantangan Infrastruktur Ibu Kota Nusantara (IKN)",
      slug: "kuliah-umum-tantangan-infrastruktur-ikn",
      content: [],
      featured_image: { url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1200", alternativeText: "Infrastruktur" },
      is_featured: true,
      categories: [{ id: 2, documentId: 'c2', name: "Kegiatan", slug: "kegiatan", color_code: "#f1b434", createdAt: "", updatedAt: "", publishedAt: "", locale: "" }],
      createdAt: "2026-03-25T10:00:00.000Z",
      updatedAt: "2026-03-25T10:00:00.000Z",
      publishedAt: "2026-03-25T10:00:00.000Z",
      locale: "id",
    },
    {
      id: 993,
      documentId: 'd-993',
      title: "STT Pekerjaan Umum Teken MoU dengan Perusahaan Konstruksi Global",
      slug: "mou-konstruksi-global",
      content: [],
      featured_image: { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200", alternativeText: "Kerjasama Global" },
      is_featured: true,
      categories: [{ id: 3, documentId: 'c3', name: "Kemitraan", slug: "kemitraan", color_code: "#3b82f6", createdAt: "", updatedAt: "", publishedAt: "", locale: "" }],
      createdAt: "2026-03-24T10:00:00.000Z",
      updatedAt: "2026-03-24T10:00:00.000Z",
      publishedAt: "2026-03-24T10:00:00.000Z",
      locale: "id",
    },
    {
      id: 994,
      documentId: 'd-994',
      title: "Penerimaan Mahasiswa Baru Gelombang 2 Resmi Dibuka",
      slug: "pmb-gelombang-2",
      content: [],
      featured_image: { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200", alternativeText: "Penerimaan Mahasiswa" },
      is_featured: true,
      categories: [{ id: 4, documentId: 'c4', name: "Pengumuman", slug: "pengumuman", color_code: "#ef4444", createdAt: "", updatedAt: "", publishedAt: "", locale: "" }],
      createdAt: "2026-03-23T10:00:00.000Z",
      updatedAt: "2026-03-23T10:00:00.000Z",
      publishedAt: "2026-03-23T10:00:00.000Z",
      locale: "id",
    },
    {
      id: 995,
      documentId: 'd-995',
      title: "Pameran Karya Akhir Mahasiswa Teknik Sipil dan Lingkungan 2026",
      slug: "pameran-karya-akhir-2026",
      content: [],
      featured_image: { url: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=1200", alternativeText: "Pameran Mahasiswa" },
      is_featured: true,
      categories: [{ id: 5, documentId: 'c5', name: "Pameran", slug: "pameran", color_code: "#8b5cf6", createdAt: "", updatedAt: "", publishedAt: "", locale: "" }],
      createdAt: "2026-03-22T10:00:00.000Z",
      updatedAt: "2026-03-22T10:00:00.000Z",
      publishedAt: "2026-03-22T10:00:00.000Z",
      locale: "id",
    }
  ];

  // Merge dummy data conditionally
  const featuredNews = [...fetchedNews];
  let dummyIndex = 0;
  while (featuredNews.length < 6 && dummyIndex < dummyNews.length) {
    featuredNews.push(dummyNews[dummyIndex] as unknown as (typeof fetchedNews)[0]);
    dummyIndex++;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar globalConfig={globalConfig} />

      <main>
        <HomeAnimations>
          <Hero
            headline={hero.headline}
            subheadline={hero.subheadline}
            ctaLabel={hero.cta_button?.label}
            ctaUrl={hero.cta_button?.url}
            news={featuredNews}
          />

          <div className="stats-section">
            <StatsSection />
          </div>

          {/* Complex Grid News Section replacing Faculties */}
          <NewsComplexGrid news={featuredNews} />

          {/* News & Updates Section */}
          <section className="py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex items-center gap-4 mb-12">
                <div className="h-px grow bg-border" />
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs whitespace-nowrap">
                  <Newspaper size={16} />
                  Kabar Kampus Terbaru
                </div>
                <div className="h-px grow bg-border" />
              </div>

              <div className="mb-16 relative w-full">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent>
                    {featuredNews.map((news) => (
                      <CarouselItem
                        key={news.id}
                        className="basis-[85%] md:basis-[45%] lg:basis-[30%]"
                      >
                        <NewsCard news={news} />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="flex justify-center md:justify-end gap-2 mt-8">
                    <CarouselPrevious className="static translate-y-0 translate-x-0 h-10 w-10 border-border bg-background hover:bg-muted text-foreground" />
                    <CarouselNext className="static translate-y-0 translate-x-0 h-10 w-10 border-border bg-background hover:bg-muted text-foreground" />
                  </div>
                </Carousel>
              </div>

              <div className="text-center">
                <Link
                  href="/berita"
                  className="inline-flex items-center gap-3 px-8 py-3 bg-card border border-border rounded-xl font-bold hover:bg-muted transition-all"
                >
                  Lihat Semua Berita <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </section>

          {/* Events & Admission Info */}
          <section className="py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-12 gap-16 items-start">
              <div className="md:col-span-7">
                <div className="flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-xs mb-6">
                  <Calendar size={16} />
                  Agenda & Kegiatan
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold mb-10 tracking-tight">
                  Kunjungi Kampus & Ikuti Kegiatan Kami
                </h2>

                <div className="flex flex-col gap-6">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>

                <Link
                  href="/agenda"
                  className="inline-block mt-8 font-bold text-primary hover:underline underline-offset-4"
                >
                  Lihat Jadwal Lengkap →
                </Link>
              </div>

              <div className="md:col-span-5 bg-primary rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700" />

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4">
                    Informasi Pendaftaran
                  </h3>
                  <p className="text-white/70 mb-8 leading-relaxed">
                    Penerimaan Mahasiswa Baru tahun akademik 2026/2027 telah
                    dibuka. Dapatkan kesempatan beasiswa khusus untuk pendaftar
                    gelombang pertama.
                  </p>

                  <div className="flex flex-col gap-4 mb-10">
                    {admission.registration_steps?.map((step) => (
                      <div
                        key={step.id}
                        className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="w-2 h-2 rounded-full bg-secondary" />
                        <span className="text-sm font-medium">
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="https://sttsaptataruna.pmbonline.siakad.tech/register"
                    className="block w-full text-center bg-secondary text-white py-4 rounded-xl font-bold text-lg hover:bg-secondary/90 transition-all shadow-xl shadow-black/20"
                  >
                    Daftar Sekarang
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </HomeAnimations>
      </main>

      <Footer globalConfig={globalConfig} />
    </div>
  );
}
