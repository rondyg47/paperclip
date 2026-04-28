/**
 * Tipos do banco — gerados depois via `pnpm db:types` (supabase CLI).
 * Por enquanto deixamos um stub mínimo para o app compilar.
 */
export type Database = {
  public: {
    Tables: Record<string, { Row: unknown; Insert: unknown; Update: unknown }>;
    Views: Record<string, { Row: unknown }>;
    Functions: Record<string, { Args: unknown; Returns: unknown }>;
    Enums: {
      role_app: "admin" | "comissao" | "atleta" | "torcedor";
      modalidade: "campo" | "futsal";
      rsvp_status: "sim" | "nao" | "talvez" | "pendente";
      post_audiencia: "publico" | "interno";
      post_tipo: "texto" | "foto" | "video" | "story";
      partida_status: "agendada" | "em_andamento" | "finalizada" | "adiada" | "cancelada";
      partida_resultado: "vitoria" | "empate" | "derrota";
    };
    CompositeTypes: Record<string, unknown>;
  };
};
