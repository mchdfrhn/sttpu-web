import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "STT Pekerjaan Umum — Kampus Teknik Unggulan Indonesia",
  description:
    "STT Pekerjaan Umum adalah kampus teknik vokasional terdepan di Indonesia, menghasilkan insinyur profesional di bidang Teknik Sipil, Lingkungan, dan Sumber Daya Air.",
  keywords: [
    "STT Pekerjaan Umum",
    "Sekolah Tinggi Teknologi Pekerjaan Umum",
    "Kampus Teknik",
    "Teknik Sipil Jakarta",
    "Teknik Lingkungan Jakarta",
    "Teknik Informatika Jakarta",
    "STTPU",
    "PUPR",
    "PU",
    "PMB 2026",
  ],
  openGraph: {
    title: "STT Pekerjaan Umum",
    description: "Kampus Teknik Unggulan Indonesia",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
