/**
 * Dados mock para desenvolvimento.
 * Remover assim que a integração com Supabase estiver completa.
 */
import { CATEGORIAS } from "@/lib/design/tokens";

export const mockProximoJogo = {
  id: "p1",
  categoria: "Principal",
  modalidade: "campo" as const,
  competicao: "2ª Divisão Municipal — Morada Nova",
  data_hora: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
  local: "Estádio Municipal",
  mandante: true,
  adversario: "Atlético União",
  rodada: 5,
};

export const mockUltimoResultado = {
  id: "p0",
  categoria: "Sub-18",
  modalidade: "futsal" as const,
  data_hora: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  mandante: true,
  adversario: "Quixerê EC",
  gols_kfc: 4,
  gols_adversario: 2,
  destaque: "Lucas Andrade — 2 gols + 1 assistência",
};

export const mockCategorias = CATEGORIAS.map((c, i) => ({
  ...c,
  jogadores: [22, 24, 26, 18, 20, 23, 16, 14][i] ?? 18,
}));

export const mockJogadores = [
  {
    id: "j1",
    nome: "Lucas Andrade",
    apelido: "Luquinha",
    numero: 10,
    posicao: "Meia",
    categoria: "Sub-18",
    modalidades: ["campo", "futsal"],
    foto_url: null,
    gols: 12,
    assistencias: 7,
  },
  {
    id: "j2",
    nome: "Pedro Henrique",
    apelido: "Pedrinho",
    numero: 9,
    posicao: "Atacante",
    categoria: "Principal",
    modalidades: ["campo"],
    foto_url: null,
    gols: 18,
    assistencias: 4,
  },
  {
    id: "j3",
    nome: "Rafael Souza",
    apelido: "Rafa",
    numero: 1,
    posicao: "Goleiro",
    categoria: "Principal",
    modalidades: ["campo"],
    foto_url: null,
    gols: 0,
    assistencias: 0,
  },
  {
    id: "j4",
    nome: "Marcos Vinícius",
    apelido: "Marquinhos",
    numero: 7,
    posicao: "Ala",
    categoria: "Futsal Adulto",
    modalidades: ["futsal"],
    foto_url: null,
    gols: 22,
    assistencias: 9,
  },
];

export const mockJogos = [
  {
    id: "p1",
    categoria: "Principal",
    modalidade: "campo" as const,
    data_hora: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    local: "Estádio Municipal",
    mandante: true,
    adversario: "Atlético União",
    status: "agendada" as const,
  },
  {
    id: "p2",
    categoria: "Sub-15",
    modalidade: "futsal" as const,
    data_hora: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    local: "Ginásio Poliesportivo",
    mandante: false,
    adversario: "Russas FC",
    status: "agendada" as const,
  },
  {
    id: "p3",
    categoria: "Sub-18",
    modalidade: "futsal" as const,
    data_hora: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    mandante: true,
    adversario: "Quixerê EC",
    gols_kfc: 4,
    gols_adversario: 2,
    status: "finalizada" as const,
  },
  {
    id: "p4",
    categoria: "Master 35",
    modalidade: "campo" as const,
    data_hora: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    mandante: false,
    adversario: "Veteranos de Limoeiro",
    gols_kfc: 2,
    gols_adversario: 2,
    status: "finalizada" as const,
  },
];

export const mockPosts = [
  {
    id: "post1",
    autor: { nome: "Comissão Técnica", avatar_url: null },
    audiencia: "publico" as const,
    tipo: "texto" as const,
    conteudo:
      "Bora, Karaúbas! 💛💙 Domingo tem clássico e vamos com tudo! Convocação completa amanhã pela manhã.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    curtidas: 47,
    comentarios: 8,
  },
  {
    id: "post2",
    autor: { nome: "Lucas Andrade", avatar_url: null },
    audiencia: "interno" as const,
    tipo: "texto" as const,
    conteudo:
      "Treino pesado hoje, mas saiu bonito! Foco total na partida do fim de semana 💪",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    curtidas: 23,
    comentarios: 4,
  },
  {
    id: "post3",
    autor: { nome: "Diretoria", avatar_url: null },
    audiencia: "publico" as const,
    tipo: "texto" as const,
    conteudo:
      "Karaúbas FC completa 16 anos no próximo dia 29! Estamos preparando uma programação especial pra toda a torcida 🎉",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    curtidas: 132,
    comentarios: 27,
  },
];
