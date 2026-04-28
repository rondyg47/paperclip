"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { criarAtleta, type AtletaState } from "@/app/c/[slug]/admin/elenco/actions";

export function AtletaForm({ clubSlug }: { clubSlug: string }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<AtletaState, FormData>(
    criarAtleta,
    { status: "idle" },
  );

  useEffect(() => {
    if (state.status === "ok") {
      router.push(`/c/${clubSlug}/admin/elenco`);
    }
  }, [state.status, clubSlug, router]);

  return (
    <form action={action} className="space-y-4">
      <Card className="p-5">
        <h2 className="font-display text-lg text-kfc-blue-900">Dados do atleta</h2>
        <div className="mt-3 grid gap-3">
          <Field label="Nome completo" htmlFor="nome_completo" required>
            <input id="nome_completo" name="nome_completo" required minLength={2} className={inputCls} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Apelido" htmlFor="apelido">
              <input id="apelido" name="apelido" className={inputCls} />
            </Field>
            <Field label="Data de nascimento" htmlFor="data_nascimento">
              <input id="data_nascimento" name="data_nascimento" type="date" className={inputCls} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Camisa" htmlFor="numero_camisa">
              <input
                id="numero_camisa"
                name="numero_camisa"
                type="number"
                min={1}
                max={99}
                placeholder="10"
                className={inputCls}
              />
            </Field>
            <Field label="Posição" htmlFor="posicao_principal">
              <input id="posicao_principal" name="posicao_principal" placeholder="Meia" className={inputCls} />
            </Field>
            <Field label="Pé dominante" htmlFor="pe_dominante">
              <select id="pe_dominante" name="pe_dominante" className={inputCls}>
                <option value="">—</option>
                <option value="destro">Destro</option>
                <option value="canhoto">Canhoto</option>
                <option value="ambidestro">Ambidestro</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Altura (cm)" htmlFor="altura_cm">
              <input id="altura_cm" name="altura_cm" type="number" min={100} max={220} className={inputCls} />
            </Field>
            <Field label="URL da foto" htmlFor="foto_url">
              <input
                id="foto_url"
                name="foto_url"
                type="url"
                placeholder="https://..."
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Observações" htmlFor="observacoes">
            <textarea id="observacoes" name="observacoes" rows={2} maxLength={500} className={inputCls} />
          </Field>
        </div>
      </Card>

      {state.status === "error" && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.message}</div>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>Cadastrar atleta</Button>
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
