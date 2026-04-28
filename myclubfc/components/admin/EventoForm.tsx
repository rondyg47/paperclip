"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { criarEvento, type EventoState } from "@/app/c/[slug]/admin/eventos/actions";

interface Categoria {
  id: string;
  nome: string;
  modalidades: ("campo" | "futsal")[];
}

export function EventoForm({
  clubSlug,
  categorias,
}: {
  clubSlug: string;
  categorias: Categoria[];
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<EventoState, FormData>(
    criarEvento,
    { status: "idle" },
  );
  const [tipo, setTipo] = useState<"treino" | "jogo" | "reuniao" | "outro">("treino");

  useEffect(() => {
    if (state.status === "ok") router.push(`/c/${clubSlug}/admin/eventos`);
  }, [state.status, clubSlug, router]);

  if (categorias.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-slate-600">Cadastre categorias antes de criar eventos.</p>
      </Card>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <Card className="p-5">
        <h2 className="font-display text-lg text-kfc-blue-900">Detalhes</h2>
        <div className="mt-3 grid gap-3">
          <div className="grid grid-cols-4 gap-2">
            {(["treino", "jogo", "reuniao", "outro"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(t)}
                className={
                  "rounded-lg border px-3 py-2 text-xs font-semibold transition-all " +
                  (tipo === t
                    ? "border-kfc-blue bg-kfc-blue text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300")
                }
              >
                {t === "treino" ? "Treino" : t === "jogo" ? "Jogo" : t === "reuniao" ? "Reunião" : "Outro"}
              </button>
            ))}
          </div>
          <input type="hidden" name="tipo" value={tipo} />

          <Field label="Título" htmlFor="titulo" required>
            <input id="titulo" name="titulo" required minLength={2} placeholder="Treino tático" className={inputCls} />
          </Field>

          <Field label="Descrição" htmlFor="descricao">
            <textarea id="descricao" name="descricao" rows={2} maxLength={500} className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Categoria" htmlFor="categoria_id" required>
              <select id="categoria_id" name="categoria_id" required className={inputCls}>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Modalidade" htmlFor="modalidade">
              <select id="modalidade" name="modalidade" className={inputCls}>
                <option value="">—</option>
                <option value="campo">Campo</option>
                <option value="futsal">Futsal</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Início" htmlFor="inicio" required>
              <input id="inicio" name="inicio" type="datetime-local" required className={inputCls} />
            </Field>
            <Field label="Fim (opcional)" htmlFor="fim">
              <input id="fim" name="fim" type="datetime-local" className={inputCls} />
            </Field>
          </div>

          <Field label="Local" htmlFor="local">
            <input id="local" name="local" placeholder="Estádio Municipal" className={inputCls} />
          </Field>
        </div>
      </Card>

      {state.status === "error" && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.message}</div>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>Criar convocação</Button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-kfc-blue focus:outline-none focus:ring-2 focus:ring-kfc-blue/20";

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
