"use client";

import { useActionState, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { criarClube, type CriarClubeState } from "@/app/criar-clube/actions";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "myclubfc.com";

export function CriarClubeForm() {
  const [state, action, pending] = useActionState<CriarClubeState, FormData>(
    criarClube,
    { status: "idle" },
  );

  const [slug, setSlug] = useState("");
  const [nome, setNome] = useState("");
  const [primary, setPrimary] = useState("#1E4FB5");
  const [secondary, setSecondary] = useState("#FFC72C");
  const [accent, setAccent] = useState("#E8651F");
  const [modalidades, setModalidades] = useState<("campo" | "futsal")[]>(["campo"]);

  function handleNomeChange(value: string) {
    setNome(value);
    if (!slug) {
      setSlug(
        value
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 32),
      );
    }
  }

  function toggleModalidade(m: "campo" | "futsal") {
    setModalidades((curr) =>
      curr.includes(m) ? curr.filter((x) => x !== m) : [...curr, m],
    );
  }

  return (
    <form action={action} className="space-y-4">
      {/* IDENTIDADE */}
      <Card className="p-5">
        <h2 className="font-display text-lg text-kfc-blue-900">Identidade</h2>
        <p className="text-xs text-slate-500">
          Nome do clube e o endereço público (subdomínio).
        </p>

        <div className="mt-4 grid gap-3">
          <Field label="Nome do clube" htmlFor="nome" required>
            <input
              id="nome"
              name="nome"
              required
              value={nome}
              onChange={(e) => handleNomeChange(e.target.value)}
              placeholder="Ex: Karaúbas Futebol Clube"
              className={inputCls}
            />
          </Field>

          <Field label="Endereço do app" htmlFor="slug" required>
            <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-200 focus-within:border-kfc-blue focus-within:ring-2 focus-within:ring-kfc-blue/20">
              <input
                id="slug"
                name="slug"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="kfc"
                pattern="[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?"
                className="flex-1 bg-white px-3 py-2.5 text-sm focus:outline-none"
              />
              <span className="flex items-center bg-slate-50 px-3 text-xs text-slate-500">
                .{ROOT_DOMAIN}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Letras minúsculas, números e hífens. Ex: <code>kfc</code> →{" "}
              <code>kfc.{ROOT_DOMAIN}</code>
            </p>
          </Field>

          <Field label="Descrição" htmlFor="descricao">
            <textarea
              id="descricao"
              name="descricao"
              rows={3}
              maxLength={500}
              placeholder="Conta um pouco da história do clube"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Cidade" htmlFor="cidade">
              <input id="cidade" name="cidade" placeholder="Morada Nova" className={inputCls} />
            </Field>
            <Field label="UF" htmlFor="uf">
              <input
                id="uf"
                name="uf"
                maxLength={2}
                placeholder="CE"
                className={inputCls + " uppercase"}
              />
            </Field>
            <Field label="Fundação" htmlFor="fundado_em">
              <input
                id="fundado_em"
                name="fundado_em"
                type="date"
                className={inputCls}
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* MODALIDADES */}
      <Card className="p-5">
        <h2 className="font-display text-lg text-kfc-blue-900">Modalidades</h2>
        <p className="text-xs text-slate-500">
          Em quais modalidades o clube tem times atualmente?
        </p>
        <div className="mt-3 flex gap-2">
          <ModalidadeButton
            active={modalidades.includes("campo")}
            onClick={() => toggleModalidade("campo")}
            label="Futebol de Campo"
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
        <h2 className="font-display text-lg text-kfc-blue-900">Cores oficiais</h2>
        <p className="text-xs text-slate-500">
          Vão pintar o app inteiro do seu clube. Pode mudar depois.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <ColorPicker
            name="cor_primaria"
            label="Principal"
            value={primary}
            onChange={setPrimary}
          />
          <ColorPicker
            name="cor_secundaria"
            label="Secundária"
            value={secondary}
            onChange={setSecondary}
          />
          <ColorPicker
            name="cor_acento"
            label="Acento"
            value={accent}
            onChange={setAccent}
          />
        </div>

        {/* PREVIEW */}
        <div
          className="mt-4 rounded-xl p-5 text-white"
          style={{
            background: `linear-gradient(135deg, ${primary} 0%, ${shade(primary, -30)} 100%)`,
          }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: secondary }}>
            Preview
          </p>
          <p className="font-display text-2xl">{nome || "Seu Clube FC"}</p>
          <div className="mt-3 flex gap-2">
            <Badge tone="yellow">Campo</Badge>
            {modalidades.includes("futsal") && <Badge tone="orange">Futsal</Badge>}
            <span
              className="ml-auto rounded-md px-2 py-0.5 text-xs font-bold"
              style={{ background: secondary, color: shade(primary, -50) }}
            >
              Próximos jogos
            </span>
          </div>
        </div>
      </Card>

      {state.status === "error" && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="submit" loading={pending} className="px-6">
          Criar meu clube
        </Button>
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

function ModalidadeButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "flex-1 rounded-lg border px-4 py-3 text-sm font-semibold transition-all " +
        (active
          ? "border-kfc-blue bg-kfc-blue text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300")
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
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer"
        />
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
