import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SouKaraubas — Karaúbas Futebol Clube",
    template: "%s · SouKaraubas",
  },
  description:
    "App oficial do Karaúbas Futebol Clube (KFC). Acompanhe elenco, jogos, estatísticas e o feed do clube.",
  manifest: "/manifest.json",
  icons: {
    icon: "/escudo.svg",
    apple: "/escudo.svg",
  },
  openGraph: {
    title: "SouKaraubas — KFC",
    description: "Acompanhe o Karaúbas FC: elenco, jogos, feed e mais.",
    type: "website",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E4FB5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${bebas.variable}`}>
      <body className="min-h-dvh font-sans">
        <div className="flex min-h-dvh flex-col">
          <Header />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
