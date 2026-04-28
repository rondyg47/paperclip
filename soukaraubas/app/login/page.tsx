import Link from "next/link";
import { Escudo } from "@/components/ui/Escudo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
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

        <form className="mt-6 space-y-3">
          <input
            type="email"
            placeholder="email@exemplo.com"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-kfc-blue focus:outline-none focus:ring-2 focus:ring-kfc-blue/20"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-kfc-blue focus:outline-none focus:ring-2 focus:ring-kfc-blue/20"
            required
          />
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">ou</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <Button variant="ghost" className="w-full border border-slate-200">
          Continuar com Google
        </Button>

        <p className="mt-4 text-center text-xs text-slate-500">
          Não tem conta?{" "}
          <Link href="/signup" className="font-semibold text-kfc-blue hover:underline">
            Criar agora
          </Link>
        </p>
      </Card>
    </div>
  );
}
