import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type SessionUser = {
  id: string;
  email: string | null;
  nome: string;
  apelido: string | null;
  avatar_url: string | null;
  role: "admin" | "comissao" | "atleta" | "torcedor";
};

/**
 * Retorna o usuário atual com o profile do app, ou null se deslogado.
 * Cacheado por request via React cache().
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, apelido, avatar_url, role, email")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return {
      id: user.id,
      email: user.email ?? null,
      nome: user.email?.split("@")[0] ?? "Torcedor",
      apelido: null,
      avatar_url: null,
      role: "torcedor",
    };
  }

  return {
    id: user.id,
    email: profile.email ?? user.email ?? null,
    nome: profile.nome,
    apelido: profile.apelido,
    avatar_url: profile.avatar_url,
    role: profile.role,
  };
});

export function isStaff(role?: SessionUser["role"]) {
  return role === "admin" || role === "comissao";
}

export function isMember(role?: SessionUser["role"]) {
  return role === "admin" || role === "comissao" || role === "atleta";
}
