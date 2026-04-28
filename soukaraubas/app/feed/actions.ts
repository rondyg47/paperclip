"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser, isMember, isStaff } from "@/lib/auth/session";

const postSchema = z.object({
  conteudo: z.string().min(1, "Escreva alguma coisa").max(2000, "Máx. 2000 caracteres"),
  audiencia: z.enum(["publico", "interno"]),
});

export type PostState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ok" };

export async function createPost(_prev: PostState, formData: FormData): Promise<PostState> {
  const user = await getSessionUser();
  if (!user) return { status: "error", message: "Faça login pra postar" };

  const parsed = postSchema.safeParse({
    conteudo: formData.get("conteudo"),
    audiencia: formData.get("audiencia"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.errors[0].message };
  }

  if (!isMember(user.role)) {
    return { status: "error", message: "Apenas membros do clube podem postar" };
  }
  if (parsed.data.audiencia === "publico" && !isStaff(user.role)) {
    return {
      status: "error",
      message: "Apenas comissão e admin podem postar no feed público",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert({
    autor_id: user.id,
    conteudo: parsed.data.conteudo,
    audiencia: parsed.data.audiencia,
    tipo: "texto",
  });

  if (error) return { status: "error", message: error.message };

  revalidatePath("/feed");
  revalidatePath("/");
  return { status: "ok" };
}

export async function toggleCurtida(postId: string) {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: "login_required" };

  const supabase = await createClient();
  const { data: existente } = await supabase
    .from("curtidas")
    .select("post_id")
    .eq("post_id", postId)
    .eq("profile_id", user.id)
    .maybeSingle();

  if (existente) {
    await supabase
      .from("curtidas")
      .delete()
      .eq("post_id", postId)
      .eq("profile_id", user.id);
  } else {
    await supabase.from("curtidas").insert({ post_id: postId, profile_id: user.id });
  }

  revalidatePath("/feed");
  return { ok: true, curtido: !existente };
}
