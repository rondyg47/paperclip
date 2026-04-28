"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/session";
import { getCurrentClub, getMyRoleInCurrentClub, isStaffRole } from "@/lib/tenant/current";

const eventoSchema = z.object({
  categoria_id: z.string().uuid(),
  tipo: z.enum(["treino", "jogo", "reuniao", "outro"]),
  modalidade: z.enum(["campo", "futsal"]).optional(),
  titulo: z.string().min(2).max(120),
  descricao: z.string().max(500).optional(),
  inicio: z.string().min(10),
  fim: z.string().optional(),
  local: z.string().max(120).optional(),
});

export type EventoState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ok"; id: string };

export async function criarEvento(_prev: EventoState, formData: FormData): Promise<EventoState> {
  const user = await getSessionUser();
  if (!user) return { status: "error", message: "Faça login" };

  const club = await getCurrentClub();
  if (!club) return { status: "error", message: "Clube não encontrado" };

  const role = await getMyRoleInCurrentClub();
  if (!isStaffRole(role)) {
    return { status: "error", message: "Apenas comissão e admin podem criar eventos" };
  }

  const parsed = eventoSchema.safeParse({
    categoria_id: formData.get("categoria_id"),
    tipo: formData.get("tipo"),
    modalidade: formData.get("modalidade") || undefined,
    titulo: formData.get("titulo"),
    descricao: formData.get("descricao") || undefined,
    inicio: formData.get("inicio"),
    fim: formData.get("fim") || undefined,
    local: formData.get("local") || undefined,
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("eventos")
    .insert({
      club_id: club.id,
      categoria_id: parsed.data.categoria_id,
      tipo: parsed.data.tipo,
      modalidade: parsed.data.modalidade,
      titulo: parsed.data.titulo,
      descricao: parsed.data.descricao,
      inicio: parsed.data.inicio,
      fim: parsed.data.fim || null,
      local: parsed.data.local,
      criado_por: user.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { status: "error", message: error?.message ?? "Erro ao criar evento" };
  }

  revalidatePath(`/c/${club.slug}/admin/eventos`);
  revalidatePath(`/c/${club.slug}/convocacao`);
  return { status: "ok", id: (data as { id: string }).id };
}
