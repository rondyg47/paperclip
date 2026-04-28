"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/session";

const rsvpSchema = z.object({
  evento_id: z.string().uuid(),
  status: z.enum(["sim", "nao", "talvez"]),
  justificativa: z.string().max(500).optional(),
});

export async function responderRsvp(formData: FormData) {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "login_required" };

  const parsed = rsvpSchema.safeParse({
    evento_id: formData.get("evento_id"),
    status: formData.get("status"),
    justificativa: formData.get("justificativa") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.errors[0].message };
  }

  const supabase = await createClient();

  const { data: atleta } = await supabase
    .from("atletas")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!atleta) {
    return { ok: false, error: "Você não está cadastrado como atleta" };
  }

  const { error } = await supabase
    .from("presencas")
    .upsert(
      {
        evento_id: parsed.data.evento_id,
        atleta_id: atleta.id,
        status: parsed.data.status,
        justificativa: parsed.data.justificativa,
        respondido_em: new Date().toISOString(),
      },
      { onConflict: "evento_id,atleta_id" },
    );

  if (error) return { ok: false, error: error.message };

  revalidatePath("/convocacao");
  return { ok: true };
}
