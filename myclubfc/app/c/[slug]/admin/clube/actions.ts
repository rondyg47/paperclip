"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/session";
import { getCurrentClub } from "@/lib/tenant/current";

const schema = z.object({
  nome: z.string().min(3).max(80),
  descricao: z.string().max(500).optional(),
  cidade: z.string().max(80).optional(),
  uf: z.string().max(2).optional(),
  fundado_em: z.string().optional(),
  escudo_url: z.string().url().optional().or(z.literal("")),
  cor_primaria: z.string().regex(/^#[0-9a-f]{6}$/i),
  cor_secundaria: z.string().regex(/^#[0-9a-f]{6}$/i),
  cor_acento: z.string().regex(/^#[0-9a-f]{6}$/i),
  modalidades: z.array(z.enum(["campo", "futsal"])).min(1),
});

export type ClubeSettingsState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ok" };

export async function atualizarClube(
  _prev: ClubeSettingsState,
  formData: FormData,
): Promise<ClubeSettingsState> {
  const user = await getSessionUser();
  if (!user) return { status: "error", message: "Faça login" };

  const club = await getCurrentClub();
  if (!club) return { status: "error", message: "Clube não encontrado" };

  const modalidades = formData.getAll("modalidades").map(String) as ("campo" | "futsal")[];
  const parsed = schema.safeParse({
    nome: formData.get("nome"),
    descricao: formData.get("descricao") || undefined,
    cidade: formData.get("cidade") || undefined,
    uf: formData.get("uf") || undefined,
    fundado_em: formData.get("fundado_em") || undefined,
    escudo_url: formData.get("escudo_url") || "",
    cor_primaria: formData.get("cor_primaria"),
    cor_secundaria: formData.get("cor_secundaria"),
    cor_acento: formData.get("cor_acento"),
    modalidades,
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("clubs")
    .update({
      nome: parsed.data.nome,
      descricao: parsed.data.descricao,
      cidade: parsed.data.cidade,
      uf: parsed.data.uf?.toUpperCase(),
      fundado_em: parsed.data.fundado_em || null,
      escudo_url: parsed.data.escudo_url || null,
      cores: {
        primary: parsed.data.cor_primaria,
        secondary: parsed.data.cor_secundaria,
        accent: parsed.data.cor_acento,
      },
      modalidades: parsed.data.modalidades,
    })
    .eq("id", club.id);

  if (error) return { status: "error", message: error.message };

  revalidatePath("/", "layout");
  return { status: "ok" };
}
