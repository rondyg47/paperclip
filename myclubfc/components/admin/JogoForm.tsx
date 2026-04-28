"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { criarJogo, type JogoState } from "@/app/c/[slug]/admin/jogos/actions";

interface Categoria {
  id: string;
  nome: string;
  modalidades: ("campo" | "futsal")[];
}

export function JogoForm({
  clubSlug,
  categorias,
}: {
  clubSlug: string;
  categorias: Categoria[];
}) {
  const router = useRouter();
  const [state, action, pending] = useActionState<JogoState, FormData>(criarJogo, {
    status: "idle",
  });
  const [categoriaId, setCategoriaId] = useState(categorias[0]?.id ?? "");
  const cat = categorias.find((c) => c.id === categoriaId);

  useEffect(() => {
    if (state.status === "ok") router.push(`/c/${clubSlug}/admin/jogos`);
  }, [state.status, clubSlug, router]);

  if (categorias.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="text-sm text-slate-600">
          Cadastre categorias antes de criar jogos.
        </p>
      </Card>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <Card className="p-5">
        <h2 className="font-display text-lg text-kfc-blue-900">Detalhes do jogo</h2>
        <div className="mt-3 grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Categoria" htmlFor="categoria_id" required>
              <select
                id="categoria_id"
                name="categoria_id"
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                required
                className={inputCls}
              >
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Modalidade" htmlFor="modalidade" required>
              <select id="modalidade" name="modalidade" required className={inputCls}>
                {cat?.modalidades.includes("campo") && <option value="campo">Campo</option>}
                {cat?.modalidades.includes("futsal") && <option value="futsal">Futsal</option>}
              </select>
            </Field>
          </div>
          <Field label="Data e hora" htmlFor="data_hora" required>
            <input
              id="data_hora"
              name="data_hora"
              type="datetime-local"
              required
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Adversário" htmlFor="adversario" required>
              <input id="adversario" name="adversario" required className={inputCls} />
            </Field>
            <Field label="Local" htmlFor="local">
              <input id="local" name="local" className={inputCls} />
            </Field>
            <Field label="Rodada" htmlFor="rodada">
              <input id="rodada" name="rodada" type="number" min={1} className={inputCls} />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              name="mandante"
              defaultChecked
              className="h-4 w-4 rounded border-slate-300 text-kfc-blue"
            />
            Jogamos em casa (mandante)
          </label>
        </div>
      </Card>

      {state.status === "error" && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.message}</div>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>Criar jogo</Button>
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
