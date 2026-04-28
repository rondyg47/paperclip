"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Escudo } from "@/components/ui/Escudo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { signup, type AuthState } from "@/app/auth/actions";

export function SignupForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(signup, {
    status: "idle",
  });

  return (
    <Card className="w-full p-6">
      <div className="flex flex-col items-center text-center">
        <Escudo size={64} priority />
        <h1 className="mt-3 font-display text-2xl text-kfc-blue-900">
          Crie sua conta
        </h1>
        <p className="text-sm text-slate-500">
          Faça parte da nação Karaúbas no app oficial do clube.
        </p>
      </div>

      <form action={action} className="mt-6 space-y-3">
        <input
          type="text"
          name="nome"
          placeholder="Seu nome"
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-kfc-blue focus:outline-none focus:ring-2 focus:ring-kfc-blue/20"
          required
          autoComplete="name"
        />
        <input
          type="email"
          name="email"
          placeholder="email@exemplo.com"
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-kfc-blue focus:outline-none focus:ring-2 focus:ring-kfc-blue/20"
          required
          autoComplete="email"
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha (mín. 6 caracteres)"
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-kfc-blue focus:outline-none focus:ring-2 focus:ring-kfc-blue/20"
          required
          minLength={6}
          autoComplete="new-password"
        />

        {state.status === "error" && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
            {state.message}
          </p>
        )}

        <Button type="submit" className="w-full" loading={pending}>
          Criar conta
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-500">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-semibold text-kfc-blue hover:underline"
        >
          Entrar
        </Link>
      </p>
      <p className="mt-2 text-center text-[10px] text-slate-400">
        Você entra como torcedor. Atletas e comissão são vinculados pela diretoria.
      </p>
    </Card>
  );
}
