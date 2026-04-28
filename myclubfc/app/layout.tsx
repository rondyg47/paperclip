import type { Metadata, Viewport } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";

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
    default: "MyClubFC — O app do seu clube de futebol",
    template: "%s · MyClubFC",
  },
  description:
    "Plataforma SaaS para clubes de futebol amador e categorias de base. Gestão, calendário, estatísticas e rede social do clube em um só app.",
  manifest: "/manifest.json",
  openGraph: {
    title: "MyClubFC",
    description: "O app do seu clube de futebol — campo e futsal, dos sub-12 ao Master.",
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
      <body className="min-h-dvh bg-slate-50 font-sans">{children}</body>
    </html>
  );
}
