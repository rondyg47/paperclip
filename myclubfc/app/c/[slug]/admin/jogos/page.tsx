import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getSessionUser } from "@/lib/auth/session";
import {
  getCurrentClub,
  getMyRoleInCurrentClub,
  isStaffRole,
} from "@/lib/tenant/current";
import { createClient } from "@/lib/supabase/server";
import { formatRelative } from "@/lib/utils/format";

export const metadata = { title: "Admin · Jogos" };

type Partida = {
  id: string;
  data_hora: string;
  adversario: string;
  mandante: boolean;
  modalidade: "campo" | "futsal";
  status: "agendada" | "em_andamento" | "finalizada" | "adiada" | "cancelada";
  local: string | null;
  gols_kfc: number | null;
  gols_adversario: number | null;
  categoria: { nome: string } | null;
};

export default async function AdminJogosPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const club = await getCurrentClub();
  if (!club) notFound();

  const role = await getMyRoleInCurrentClub();
  if (!isStaffRole(role)) {
    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <p className="rounded-lg bg-red-50 p-6 text-center text-sm text-red-700">
          Apenas comissão e admin podem gerenciar jogos.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("partidas")
    .select(
      "id, data_hora, adversario, mandante, modalidade, status, local, gols_kfc, gols_adversario, categoria:categorias(nome)",
    )
    .eq("club_id", club.id)
    .order("data_hora", { ascending: false })
    .limit(50);

  const jogos = (data ?? []) as unknown as Partida[];
  const base = `/c/${club.slug}/admin`;

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-0">
      <PageHeader
        title="Jogos"
        subtitle={`${jogos.length} partidas registradas`}
        action={
          <Link
            href={`${base}/jogos/novo`}
            className="flex items-center gap-1.5 rounded-lg bg-kfc-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-kfc-blue-700"
          >
            <Plus size={14} /> Novo jogo
          </Link>
        }
      />

      {jogos.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar size={28} className="mx-auto mb-2 text-slate-400" />
          <p className="text-sm text-slate-600">Nenhum jogo cadastrado ainda.</p>
          <Link
            href={`${base}/jogos/novo`}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-kfc-blue px-4 py-2 text-sm font-semibold text-white hover:bg-kfc-blue-700"
          >
            <Plus size={16} /> Cadastrar primeiro jogo
          </Link>
        </Card>
      ) : (
        <div className="grid gap-2 pb-6">
          {jogos.map((j) => (
            <Card key={j.id} className="p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  {j.categoria && <Badge tone="blue">{j.categoria.nome}</Badge>}
                  <Badge tone={j.modalidade === "futsal" ? "orange" : "yellow"}>
                    {j.modalidade === "futsal" ? "Futsal" : "Campo"}
                  </Badge>
                  <Badge tone={statusTone(j.status)}>{statusLabel(j.status)}</Badge>
                </div>
                <span className="text-xs text-slate-500">{formatRelative(j.data_hora)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm">
                  <span className="font-semibold">{j.mandante ? club.nome.split(" ")[0] : j.adversario}</span>
                  {j.status === "finalizada" && j.gols_kfc !== null ? (
                    <span className="font-display text-lg text-kfc-blue mx-2">
                      {j.mandante ? j.gols_kfc : j.gols_adversario}
                      {" × "}
                      {j.mandante ? j.gols_adversario : j.gols_kfc}
                    </span>
                  ) : (
                    <span className="text-slate-400 mx-2">×</span>
                  )}
                  <span className="font-semibold">{j.mandante ? j.adversario : club.nome.split(" ")[0]}</span>
                </p>
                <Link
                  href={`${base}/jogos/${j.id}`}
                  className="text-xs font-semibold text-kfc-blue hover:underline"
                >
                  Editar
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function statusLabel(s: Partida["status"]) {
  return {
    agendada: "Agendada",
    em_andamento: "Em jogo",
    finalizada: "Finalizada",
    adiada: "Adiada",
    cancelada: "Cancelada",
  }[s];
}

function statusTone(s: Partida["status"]): "slate" | "green" | "yellow" | "red" | "blue" {
  return {
    agendada: "slate" as const,
    em_andamento: "green" as const,
    finalizada: "blue" as const,
    adiada: "yellow" as const,
    cancelada: "red" as const,
  }[s];
}
