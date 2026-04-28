/**
 * Design tokens — Karaúbas Futebol Clube
 * Cores oficiais extraídas do escudo. Mantenha sincronizado com tailwind.config.ts.
 */

export const KFC_BRAND = {
  name: "Karaúbas Futebol Clube",
  shortName: "KFC",
  foundedAt: "2009-08-29",
  foundedLabel: "29 de agosto de 2009",
} as const;

export const KFC_COLORS = {
  blue: "#1E4FB5",
  yellow: "#FFC72C",
  orange: "#E8651F",
  blueDark: "#102C68",
  blueLight: "#4F7CC8",
} as const;

export const MODALIDADES = ["campo", "futsal"] as const;
export type Modalidade = (typeof MODALIDADES)[number];

export const CATEGORIAS = [
  { slug: "sub-12", nome: "Sub-12", modalidades: ["campo", "futsal"], faixa_etaria: "Até 12 anos" },
  { slug: "sub-15", nome: "Sub-15", modalidades: ["campo", "futsal"], faixa_etaria: "13–15 anos" },
  { slug: "sub-18", nome: "Sub-18", modalidades: ["campo", "futsal"], faixa_etaria: "16–18 anos" },
  { slug: "master-35", nome: "Master 35", modalidades: ["campo"], faixa_etaria: "35+ anos" },
  { slug: "principal", nome: "Principal", modalidades: ["campo"], faixa_etaria: "Adulto" },
  { slug: "aspirantes", nome: "Aspirantes", modalidades: ["campo"], faixa_etaria: "Adulto" },
  { slug: "escolinha", nome: "Escolinha", modalidades: ["campo"], faixa_etaria: "Iniciação" },
  { slug: "futsal-adulto", nome: "Futsal Adulto", modalidades: ["futsal"], faixa_etaria: "Adulto" },
] as const;

export type CategoriaSlug = (typeof CATEGORIAS)[number]["slug"];

export const ROLES = ["admin", "comissao", "atleta", "torcedor"] as const;
export type Role = (typeof ROLES)[number];
