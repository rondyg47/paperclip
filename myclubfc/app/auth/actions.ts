"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const credentialsSchema = z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

const signupSchema = credentialsSchema.extend({
  nome: z.string().min(2, "Nome muito curto"),
});

export type AuthState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ok" };

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get("email"),
    senha: formData.get("senha"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.senha,
  });
  if (error) {
    return { status: "error", message: traduzirErro(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    senha: formData.get("senha"),
    nome: formData.get("nome"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.errors[0].message };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.senha,
    options: { data: { nome: parsed.data.nome } },
  });
  if (error) {
    return { status: "error", message: traduzirErro(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function loginWithGoogle() {
  const supabase = await createClient();
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${origin}/auth/callback` },
  });
  if (error) throw error;
  if (data.url) redirect(data.url);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

function traduzirErro(msg: string) {
  if (msg.includes("Invalid login")) return "Email ou senha incorretos";
  if (msg.includes("already registered")) return "Esse email já tem conta";
  if (msg.includes("Email not confirmed")) return "Confirme seu email pra entrar";
  return msg;
}
