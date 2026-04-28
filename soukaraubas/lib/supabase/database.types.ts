/**
 * Tipos do banco — gerados depois via `pnpm db:types` (supabase CLI).
 * Por enquanto deixamos um stub com shape permissivo: as tabelas existem mas
 * suas colunas são `any`. Isso faz `.from(...)` reconhecer os nomes das tabelas
 * e permite inserts/selects sem checagem rigorosa de colunas até a geração real.
 */

type GenericTable = {
  Row: Record<string, unknown>;
  Insert: Record<string, unknown>;
  Update: Record<string, unknown>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: GenericTable;
      categorias: GenericTable;
      atletas: GenericTable;
      atleta_categorias: GenericTable;
      competicoes: GenericTable;
      partidas: GenericTable;
      escalacoes: GenericTable;
      partida_eventos: GenericTable;
      estatisticas_atleta: GenericTable;
      eventos: GenericTable;
      presencas: GenericTable;
      posts: GenericTable;
      curtidas: GenericTable;
      comentarios: GenericTable;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      role_app: "admin" | "comissao" | "atleta" | "torcedor";
      modalidade: "campo" | "futsal";
      rsvp_status: "sim" | "nao" | "talvez" | "pendente";
      post_audiencia: "publico" | "interno";
      post_tipo: "texto" | "foto" | "video" | "story";
      partida_status:
        | "agendada"
        | "em_andamento"
        | "finalizada"
        | "adiada"
        | "cancelada";
      partida_resultado: "vitoria" | "empate" | "derrota";
    };
    CompositeTypes: Record<string, never>;
  };
};
