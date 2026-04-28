"use client";

import { useActionState, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { atualizarClube, type ClubeSettingsState } from "@/app/c/[slug]/admin/clube/actions";
import type { Club } from "@/lib/tenant/current";

export function ClubeSettingsForm({ club }: { club: Club }) {
  const [state, action, pending] = useActionState<ClubeSettingsState, FormData>(
    atualizarClube,
    { status: "idle" },
  );
  const [primary, setPrimary] = useState(club.cores.primary);
  const [secondary, setSecondary] = useState(club.cores.secondary);
  const [accent, setAccent] = useState(club.cores.accent);
  const [modalidades, setModalidades] = useState<("campo" | "futsal")[]>(
    club.modalidades.length > 0 ? club.modalidades : ["campo"],
  );

  function toggleModalidade(m: "campo" | "futsal") {
    setModalidades((curr) =>
      curr.includes(m) ? curr.filter((x) => x !== m) : [...curr, m],
    );
  }

  return (
    <form action={action} className="space-y-4">
      {/* DADOS BÁSICOS */}
      <Card className="p-5">
        <h2 className="font-display text-lg text-kfc-blue-900">Identidade</h2>
        <div className="mt-3 grid gap-3">
          <Field label="Nome do clube" htmlFor="nome">
            <input id="nome" name="nome" defaultValue={club.nome} required className={inputCls} />
          </Field>
          <Field label="Descrição" htmlFor="descricao">
            <textarea
              id="descricao"
              name="descricao"
              defaultValue={club.descricao ?? ""}
              rows={3}
              maxLength={500}
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Cidade" htmlFor="cidade">
              <input
                id="cidade"
                name="cidade"
                defaultValue={club.cidade ?? ""}
                className={inputCls}
              />
            </Field>
            <Field label="UF" htmlFor="uf">
              <input
                id="uf"
                name="uf"
                defaultValue={club.uf ?? ""}
                maxLength={2}
                className={inputCls + " uppercase"}
              />
            </Field>
            <Field label="Fundação" htmlFor="fundado_em">
              <input
                id="fundado_em"
                name="fundado_em"
                type="date"
                defaultValue={club.fundado_em ?? ""}
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="URL do escudo (PNG/SVG público)" htmlFor="escudo_url">
            <input
              id="escudo_url"
              name="escudo_url"
              type="url"
              defaultValue={club.escudo_url ?? ""}
              placeholder="https://exemplo.com/escudo.png"
              className={inputCls}
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Cole o link do escudo. Upload direto via Supabase Storage virá na próxima fase.
            </p>
          </Field>
        </div>
      </Card>

      {/* MODALIDADES */}
      <Card className="p-5">
        <h2 className="font-display text-lg text-kfc-blue-900">Modalidades</h2>
        <div className="mt-3 flex gap-2">
          <ModalidadeButton
            active={modalidades.includes("campo")}
            onClick={() => toggleModalidade("campo")}
            label="Campo"
          />
          <ModalidadeButton
            active={modalidades.includes("futsal")}
            onClick={() => toggleModalidade("futsal")}
            label="Futsal"
          />
        </div>
        {modalidades.map((m) => (
          <input key={m} type="hidden" name="modalidades" value={m} />
        ))}
      </Card>

      {/* CORES */}
      <Card className="p-5">
        <h2 className="font-display text-lg text-kfc-blue-900">Cores</h2>
        <div className="mt-3 grid grid-cols-3 gap-3">
          <ColorPicker name="cor_primaria" label="Principal" value={primary} onChange={setPrimary} />
          <ColorPicker name="cor_secundaria" label="Secundária" value={secondary} onChange={setSecondary} />
          <ColorPicker name="cor_acento" label="Acento" value={accent} onChange={setAccent} />
        </div>
        <div
          className="mt-4 rounded-xl p-4 text-white"
          style={{ background: `linear-gradient(135deg, ${primary} 0%, ${shade(primary, -30)} 100%)` }}
        >
          <p className="font-display text-xl">{club.nome}</p>
          <div className="mt-1 flex gap-1">
            <Badge tone="yellow">Campo</Badge>
            {modalidades.includes("futsal") && <Badge tone="orange">Futsal</Badge>}
          </div>
        </div>
      </Card>

      {state.status === "error" && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.message}</div>
      )}
      {state.status === "ok" && (
        <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
          Configurações atualizadas com sucesso!
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={pending}>Salvar alterações</Button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-kfc-blue focus:outline-none focus:ring-2 focus:ring-kfc-blue/20";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold text-slate-700">{label}</label>
      {children}
    </div>
  );
}

function ModalidadeButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex-1 rounded-lg border px-4 py-2 text-sm font-semibold transition-all " +
        (active ? "border-kfc-blue bg-kfc-blue text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300")
      }
    >
      {label}
    </button>
  );
}

function ColorPicker({
  name,
  label,
  value,
  onChange,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-slate-700">{label}</label>
      <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-200">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 cursor-pointer" />
        <input
          type="text"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          pattern="^#[0-9a-fA-F]{6}$"
          className="flex-1 bg-white px-3 text-sm font-mono focus:outline-none"
        />
      </div>
    </div>
  );
}

function shade(hex: string, pct: number) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = clamp(((num >> 16) & 0xff) + Math.round(2.55 * pct));
  const g = clamp(((num >> 8) & 0xff) + Math.round(2.55 * pct));
  const b = clamp((num & 0xff) + Math.round(2.55 * pct));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function clamp(v: number) {
  return Math.max(0, Math.min(255, v));
}
