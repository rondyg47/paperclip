"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Escudo } from "@/components/ui/Escudo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { login, loginWithGoogle, type AuthState } from "@/app/auth/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<AuthState, FormData>(login, {
    status: "idle",
  });

  return (
    <Card className="w-full p-6">
      <div className="flex flex-col items-center text-center">
        <Escudo size={64} priority />
        <h1 className="mt-3 font-display text-2xl text-kfc-blue-900">
          Bem-vindo de volta
        </h1>
        <p className="text-sm text-slate-500">
          Entre pra ver convocações, feed interno e suas estatísticas.
        </p>
      </div>

      <form action={action} className="mt-6 space-y-3">
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
          placeholder="Senha"
          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-kfc-blue focus:outline-none focus:ring-2 focus:ring-kfc-blue/20"
          required
          autoComplete="current-password"
        />

        {state.status === "error" && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
            {state.message}
          </p>
        )}

        <Button type="submit" className="w-full" loading={pending}>
          Entrar
        </Button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">ou</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <form action={loginWithGoogle}>
        <Button
          type="submit"
          variant="ghost"
          className="w-full border border-slate-200"
        >
          Continuar com Google
        </Button>
      </form>

      <p className="mt-4 text-center text-xs text-slate-500">
        Não tem conta?{" "}
        <Link
          href="/signup"
          className="font-semibold text-kfc-blue hover:underline"
        >
          Criar agora
        </Link>
      </p>
    </Card>
  );
}
