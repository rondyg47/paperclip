import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Plus, Calendar, MapPin } from "lucide-react";
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

export const metadata = { title: "Admin · Eventos" };

type Evento = {
  id: string;
  titulo: string;
  descricao: string | null;
  inicio: string;
  local: string | null;
  tipo: "treino" | "jogo" | "reuniao" | "outro";
  modalidade: "campo" | "futsal" | null;
  categoria: { nome: string } | null;
  presencas: { status: string }[];
};

export default async function AdminEventosPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const club = await getCurrentClub();
  if (!club) notFound();

  const role = await getMyRoleInCurrentClub();
  if (!isStaffRole(role)) {
    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <p className="rounded-lg bg-red-50 p-6 text-center text-sm text-red-700">
          Apenas comissão e admin podem gerenciar eventos.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("eventos")
    .select(
      "id, titulo, descricao, inicio, local, tipo, modalidade, categoria:categorias(nome), presencas(status)",
    )
    .eq("club_id", club.id)
    .order("inicio", { ascending: false })
    .limit(50);

  const eventos = (data ?? []) as unknown as Evento[];
  const base = `/c/${club.slug}/admin`;

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-0">
      <PageHeader
        title="Convocações"
        subtitle="Treinos, jogos, reuniões — e quem confirmou presença"
        action={
          <Link
            href={`${base}/eventos/novo`}
            className="flex items-center gap-1.5 rounded-lg bg-kfc-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-kfc-blue-700"
          >
            <Plus size={14} /> Novo evento
          </Link>
        }
      />

      {eventos.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar size={28} className="mx-auto mb-2 text-slate-400" />
          <p className="text-sm text-slate-600">Nenhuma convocação criada.</p>
          <Link
            href={`${base}/eventos/novo`}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-kfc-blue px-4 py-2 text-sm font-semibold text-white hover:bg-kfc-blue-700"
          >
            <Plus size={16} /> Criar primeira convocação
          </Link>
        </Card>
      ) : (
        <div className="grid gap-2 pb-6">
          {eventos.map((ev) => {
            const sim = ev.presencas?.filter((p) => p.status === "sim").length ?? 0;
            const nao = ev.presencas?.filter((p) => p.status === "nao").length ?? 0;
            const talvez = ev.presencas?.filter((p) => p.status === "talvez").length ?? 0;
            return (
              <Card key={ev.id} className="p-3">
                <div className="flex items-center gap-2 text-xs">
                  <Badge tone={tipoTone(ev.tipo)}>{tipoLabel(ev.tipo)}</Badge>
                  {ev.categoria && <Badge tone="blue">{ev.categoria.nome}</Badge>}
                  {ev.modalidade && (
                    <Badge tone={ev.modalidade === "futsal" ? "orange" : "yellow"}>
                      {ev.modalidade === "futsal" ? "Futsal" : "Campo"}
                    </Badge>
                  )}
                  <span className="ml-auto text-slate-500">
                    {formatRelative(ev.inicio)}
                  </span>
                </div>
                <p className="mt-2 font-semibold text-slate-800">{ev.titulo}</p>
                {ev.local && (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin size={12} /> {ev.local}
                  </p>
                )}
                <div className="mt-2 flex gap-3 text-xs">
                  <span className="text-emerald-600 font-semibold">✓ {sim}</span>
                  <span className="text-yellow-600 font-semibold">? {talvez}</span>
                  <span className="text-red-600 font-semibold">✗ {nao}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function tipoLabel(t: Evento["tipo"]) {
  return { treino: "Treino", jogo: "Jogo", reuniao: "Reunião", outro: "Evento" }[t];
}

function tipoTone(t: Evento["tipo"]): "blue" | "orange" | "slate" | "yellow" {
  return ({ treino: "blue", jogo: "orange", reuniao: "slate", outro: "yellow" } as const)[t];
}
