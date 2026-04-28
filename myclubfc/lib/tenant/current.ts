import { cache } from "react";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type Club = {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  escudo_url: string | null;
  cores: { primary: string; secondary: string; accent: string };
  fundado_em: string | null;
  cidade: string | null;
  uf: string | null;
  modalidades: ("campo" | "futsal")[];
  plano: "free" | "pro" | "enterprise";
};

/**
 * Tenta obter o slug do tenant a partir do header injetado pelo middleware.
 * Retorna null em rotas marketing.
 */
export async function getTenantSlug(): Promise<string | null> {
  const h = await headers();
  return h.get("x-tenant-slug");
}

/**
 * Carrega o clube atual baseado no header `x-tenant-slug`. Cacheado por request.
 */
export const getCurrentClub = cache(async (): Promise<Club | null> => {
  const slug = await getTenantSlug();
  if (!slug) return null;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    // Modo dev sem Supabase: retorna mock do KFC
    if (slug === "kfc") {
      return {
        id: "kfc-mock-id",
        slug: "kfc",
        nome: "Karaúbas Futebol Clube",
        descricao:
          "O Karaúbas FC nasceu da paixão pelo futebol e cresceu se tornando referência regional. Hoje somos 8 categorias ativas, em campo e no futsal.",
        escudo_url: null,
        cores: { primary: "#1E4FB5", secondary: "#FFC72C", accent: "#E8651F" },
        fundado_em: "2009-08-29",
        cidade: "Morada Nova",
        uf: "CE",
        modalidades: ["campo", "futsal"],
        plano: "free",
      };
    }
    return null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("clubs")
    .select("*")
    .eq("slug", slug)
    .eq("ativo", true)
    .maybeSingle();

  return data as Club | null;
});

/**
 * Retorna a role do usuário atual no clube atual (ou null se anônimo / não-membro).
 */
export const getMyRoleInCurrentClub = cache(async () => {
  const supabase = await createClient();
  const club = await getCurrentClub();
  if (!club) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("club_memberships")
    .select("role")
    .eq("profile_id", user.id)
    .eq("club_id", club.id)
    .maybeSingle();

  return (data as { role: "admin" | "comissao" | "atleta" | "torcedor" } | null)?.role ?? null;
});

export function isStaffRole(role?: string | null) {
  return role === "admin" || role === "comissao";
}

export function isMemberRole(role?: string | null) {
  return role === "admin" || role === "comissao" || role === "atleta";
}
