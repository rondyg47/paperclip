"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentClub } from "@/lib/tenant/current";
import { getMyRoleInCurrentClub, isStaffRole } from "@/lib/tenant/current";

const atletaSchema = z.object({
  nome_completo: z.string().min(2).max(100),
  apelido: z.string().max(40).optional(),
  data_nascimento: z.string().optional(),
  posicao_principal: z.string().max(40).optional(),
  numero_camisa: z.coerce.number().int().positive().max(99).optional(),
  pe_dominante: z.enum(["destro", "canhoto", "ambidestro"]).optional(),
  altura_cm: z.coerce.number().int().min(100).max(220).optional(),
  foto_url: z.string().url().optional().or(z.literal("")),
  observacoes: z.string().max(500).optional(),
});

export type AtletaState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ok"; id: string };

export async function criarAtleta(
  _prev: AtletaState,
  formData: FormData,
): Promise<AtletaState> {
  const club = await getCurrentClub();
  if (!club) return { status: "error", message: "Clube não encontrado" };

  const role = await getMyRoleInCurrentClub();
  if (!isStaffRole(role)) {
    return { status: "error", message: "Apenas comissão e admin podem cadastrar atletas" };
  }

  const parsed = atletaSchema.safeParse({
    nome_completo: formData.get("nome_completo"),
    apelido: formData.get("apelido") || undefined,
    data_nascimento: formData.get("data_nascimento") || undefined,
    posicao_principal: formData.get("posicao_principal") || undefined,
    numero_camisa: formData.get("numero_camisa") || undefined,
    pe_dominante: formData.get("pe_dominante") || undefined,
    altura_cm: formData.get("altura_cm") || undefined,
    foto_url: formData.get("foto_url") || "",
    observacoes: formData.get("observacoes") || undefined,
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("atletas")
    .insert({
      club_id: club.id,
      nome_completo: parsed.data.nome_completo,
      apelido: parsed.data.apelido,
      data_nascimento: parsed.data.data_nascimento || null,
      posicao_principal: parsed.data.posicao_principal,
      numero_camisa: parsed.data.numero_camisa,
      pe_dominante: parsed.data.pe_dominante,
      altura_cm: parsed.data.altura_cm,
      foto_url: parsed.data.foto_url || null,
      observacoes: parsed.data.observacoes,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { status: "error", message: error?.message ?? "Erro ao cadastrar atleta" };
  }

  revalidatePath(`/c/${club.slug}/admin/elenco`);
  revalidatePath(`/c/${club.slug}/elenco`);
  return { status: "ok", id: (data as { id: string }).id };
}

export async function deletarAtleta(atletaId: string) {
  const club = await getCurrentClub();
  if (!club) return { ok: false, error: "Clube não encontrado" };

  const role = await getMyRoleInCurrentClub();
  if (!isStaffRole(role)) return { ok: false, error: "Sem permissão" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("atletas")
    .delete()
    .eq("id", atletaId)
    .eq("club_id", club.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/c/${club.slug}/admin/elenco`);
  revalidatePath(`/c/${club.slug}/elenco`);
  return { ok: true };
}
