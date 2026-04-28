"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/session";
import { tenantUrl } from "@/lib/tenant/resolve";

const SLUG_REGEX = /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?$/;

const schema = z.object({
  nome: z.string().min(3, "Nome muito curto").max(80),
  slug: z
    .string()
    .min(2, "Slug muito curto")
    .max(32, "Slug muito longo")
    .regex(SLUG_REGEX, "Use letras minúsculas, números e hífens"),
  descricao: z.string().max(500).optional(),
  cidade: z.string().max(80).optional(),
  uf: z.string().length(2).optional(),
  fundado_em: z.string().optional(),
  cor_primaria: z.string().regex(/^#[0-9a-f]{6}$/i, "Hex inválido"),
  cor_secundaria: z.string().regex(/^#[0-9a-f]{6}$/i, "Hex inválido"),
  cor_acento: z.string().regex(/^#[0-9a-f]{6}$/i, "Hex inválido"),
  modalidades: z.array(z.enum(["campo", "futsal"])).min(1, "Escolha ao menos 1 modalidade"),
});

export type CriarClubeState =
  | { status: "idle" }
  | { status: "error"; message: string; field?: string }
  | { status: "ok"; slug: string };

const RESERVED = new Set(["www", "app", "api", "admin", "auth", "static", "cdn", "myclubfc"]);

export async function criarClube(
  _prev: CriarClubeState,
  formData: FormData,
): Promise<CriarClubeState> {
  const user = await getSessionUser();
  if (!user) return { status: "error", message: "Faça login pra criar um clube" };

  const modalidades = formData.getAll("modalidades").map(String) as ("campo" | "futsal")[];
  const parsed = schema.safeParse({
    nome: formData.get("nome"),
    slug: String(formData.get("slug") ?? "").toLowerCase().trim(),
    descricao: formData.get("descricao") || undefined,
    cidade: formData.get("cidade") || undefined,
    uf: formData.get("uf") || undefined,
    fundado_em: formData.get("fundado_em") || undefined,
    cor_primaria: formData.get("cor_primaria"),
    cor_secundaria: formData.get("cor_secundaria"),
    cor_acento: formData.get("cor_acento"),
    modalidades,
  });
  if (!parsed.success) {
    const first = parsed.error.errors[0];
    return { status: "error", message: first.message, field: first.path[0]?.toString() };
  }

  if (RESERVED.has(parsed.data.slug)) {
    return { status: "error", message: "Esse slug é reservado pela plataforma", field: "slug" };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("clubs")
    .select("id")
    .eq("slug", parsed.data.slug)
    .maybeSingle();
  if (existing) {
    return { status: "error", message: "Já existe um clube com esse endereço", field: "slug" };
  }

  const { data: club, error } = await supabase
    .from("clubs")
    .insert({
      slug: parsed.data.slug,
      nome: parsed.data.nome,
      descricao: parsed.data.descricao,
      cidade: parsed.data.cidade,
      uf: parsed.data.uf?.toUpperCase(),
      fundado_em: parsed.data.fundado_em || null,
      cores: {
        primary: parsed.data.cor_primaria,
        secondary: parsed.data.cor_secundaria,
        accent: parsed.data.cor_acento,
      },
      modalidades: parsed.data.modalidades,
      criado_por: user.id,
    })
    .select("id, slug")
    .single();

  if (error || !club) {
    return { status: "error", message: error?.message ?? "Erro ao criar o clube" };
  }

  revalidatePath("/", "layout");
  redirect(tenantUrl((club as { slug: string }).slug));
}
