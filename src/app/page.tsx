import {
  getHeroSection,
  getGlobalConfig,
  getFaculties,
  getFeaturedNews,
  getEvents,
  getAdmissionInfo,
} from "@/app/lib/strapi";
import {
  Navbar,
  Hero,
  FacultyCard,
  NewsCard,
  EventCard,
  StatsSection,
  Footer,
} from "@/components/home-ui";
import { HomeAnimations } from "@/components/home-animations";
import Link from "next/link";
import { ArrowRight, Calendar, Newspaper, GraduationCap } from "lucide-react";

export default async function Home() {
  // Fetch common data in parallel for performance (Next.js will handle deduplication and caching)
  const [heroRes, globalRes, facultiesRes, newsRes, eventsRes, admissionRes] =
    await Promise.all([
      getHeroSection(),
      getGlobalConfig(),
      getFaculties(),
      getFeaturedNews(3), // Limit to 3 featured news
      getEvents({ pagination: { pageSize: 3 } }), // Limit to 3 events
      getAdmissionInfo(),
    ]);

  const hero = heroRes.data;
  const globalConfig = globalRes.data;
  const faculties = facultiesRes.data;
  const featuredNews = newsRes.data;
  const upcomingEvents = eventsRes.data;
  const admission = admissionRes.data;

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
          />

          <div className="stats-section">
            <StatsSection />
          </div>

          {/* Faculties Section */}
          <section className="py-24 bg-background overflow-hidden blueprint-grid opacity-80">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-secondary font-bold uppercase tracking-widest text-xs mb-4">
                    <GraduationCap size={16} />
                    Fakultas & Program Studi
                  </div>
                  <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-balance">
                    Membangun Masa Depan Melalui Pendidikan Teknik
                  </h2>
                </div>
                <Link
                  href="/akademik"
                  className="group flex items-center gap-2 font-bold text-primary hover:gap-3 transition-all"
                >
                  Semua Jurusan{" "}
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Link>
              </div>

              <div className="faculty-grid grid md:grid-cols-3 gap-8">
                {faculties.map((faculty) => (
                  <FacultyCard key={faculty.id} faculty={faculty} />
                ))}
              </div>
            </div>
          </section>

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

              <div className="news-grid grid md:grid-cols-3 gap-8 mb-16">
                {featuredNews.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
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
                    href="/pmb"
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
