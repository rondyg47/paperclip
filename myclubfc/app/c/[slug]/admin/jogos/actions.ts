"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getCurrentClub, getMyRoleInCurrentClub, isStaffRole } from "@/lib/tenant/current";

const jogoSchema = z.object({
  categoria_id: z.string().uuid(),
  modalidade: z.enum(["campo", "futsal"]),
  data_hora: z.string().datetime().or(z.string().min(10)),
  adversario: z.string().min(2).max(80),
  mandante: z.coerce.boolean().default(true),
  local: z.string().max(120).optional(),
  rodada: z.coerce.number().int().min(0).max(50).optional(),
});

export type JogoState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ok"; id: string };

export async function criarJogo(_prev: JogoState, formData: FormData): Promise<JogoState> {
  const club = await getCurrentClub();
  if (!club) return { status: "error", message: "Clube não encontrado" };

  const role = await getMyRoleInCurrentClub();
  if (!isStaffRole(role)) {
    return { status: "error", message: "Apenas comissão e admin podem criar jogos" };
  }

  const parsed = jogoSchema.safeParse({
    categoria_id: formData.get("categoria_id"),
    modalidade: formData.get("modalidade"),
    data_hora: formData.get("data_hora"),
    adversario: formData.get("adversario"),
    mandante: formData.get("mandante") === "on" || formData.get("mandante") === "true",
    local: formData.get("local") || undefined,
    rodada: formData.get("rodada") || undefined,
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("partidas")
    .insert({
      club_id: club.id,
      categoria_id: parsed.data.categoria_id,
      modalidade: parsed.data.modalidade,
      data_hora: parsed.data.data_hora,
      adversario: parsed.data.adversario,
      mandante: parsed.data.mandante,
      local: parsed.data.local,
      rodada: parsed.data.rodada,
      status: "agendada",
    })
    .select("id")
    .single();

  if (error || !data) {
    return { status: "error", message: error?.message ?? "Erro ao criar jogo" };
  }

  revalidatePath(`/c/${club.slug}/admin/jogos`);
  revalidatePath(`/c/${club.slug}/jogos`);
  return { status: "ok", id: (data as { id: string }).id };
}

const resultadoSchema = z.object({
  partida_id: z.string().uuid(),
  gols_kfc: z.coerce.number().int().min(0).max(99),
  gols_adversario: z.coerce.number().int().min(0).max(99),
});

export async function registrarResultado(formData: FormData) {
  const club = await getCurrentClub();
  if (!club) return { ok: false, error: "Clube não encontrado" };

  const role = await getMyRoleInCurrentClub();
  if (!isStaffRole(role)) return { ok: false, error: "Sem permissão" };

  const parsed = resultadoSchema.safeParse({
    partida_id: formData.get("partida_id"),
    gols_kfc: formData.get("gols_kfc"),
    gols_adversario: formData.get("gols_adversario"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.errors[0].message };

  const resultado =
    parsed.data.gols_kfc > parsed.data.gols_adversario
      ? "vitoria"
      : parsed.data.gols_kfc < parsed.data.gols_adversario
      ? "derrota"
      : "empate";

  const supabase = await createClient();
  const { error } = await supabase
    .from("partidas")
    .update({
      gols_kfc: parsed.data.gols_kfc,
      gols_adversario: parsed.data.gols_adversario,
      resultado,
      status: "finalizada",
    })
    .eq("id", parsed.data.partida_id)
    .eq("club_id", club.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/c/${club.slug}/admin/jogos`);
  revalidatePath(`/c/${club.slug}/jogos`);
  return { ok: true };
}
