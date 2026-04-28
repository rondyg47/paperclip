import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { RsvpButtons } from "@/components/convocacao/RsvpButtons";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/auth/session";
import { formatRelative } from "@/lib/utils/format";

export const metadata = { title: "Convocação" };

type EventoComPresenca = {
  id: string;
  tipo: "treino" | "jogo" | "reuniao" | "outro";
  titulo: string;
  descricao: string | null;
  inicio: string;
  fim: string | null;
  local: string | null;
  modalidade: "campo" | "futsal" | null;
  categoria: { nome: string } | null;
  presencas: { status: "sim" | "nao" | "talvez" | "pendente" }[];
};

const tipoLabels = {
  treino: { label: "Treino", tone: "blue" as const },
  jogo: { label: "Jogo", tone: "orange" as const },
  reuniao: { label: "Reunião", tone: "slate" as const },
  outro: { label: "Evento", tone: "yellow" as const },
};

export default async function ConvocacaoPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/convocacao");

  const supabase = await createClient();
  const { data: eventos } = await supabase
    .from("eventos")
    .select(
      "id, tipo, titulo, descricao, inicio, fim, local, modalidade, categoria:categorias(nome), presencas(status)",
    )
    .gte("inicio", new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString())
    .order("inicio", { ascending: true })
    .limit(50);

  const lista = (eventos ?? []) as unknown as EventoComPresenca[];

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-0">
      <PageHeader
        title="Convocação"
        subtitle="Confirme presença em treinos e jogos"
      />

      {lista.length === 0 ? (
        <Card className="p-8 text-center">
          <Calendar size={28} className="mx-auto mb-2 text-slate-400" />
          <p className="text-sm text-slate-600">
            Nenhuma convocação ativa. Quando a comissão criar um evento, ele
            aparece aqui.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 pb-6">
          {lista.map((ev) => {
            const tipo = tipoLabels[ev.tipo];
            const meuStatus = ev.presencas?.[0]?.status;
            return (
              <Card key={ev.id} className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Badge tone={tipo.tone}>{tipo.label}</Badge>
                    {ev.categoria && <Badge tone="blue">{ev.categoria.nome}</Badge>}
                    {ev.modalidade && (
                      <Badge tone={ev.modalidade === "futsal" ? "orange" : "yellow"}>
                        {ev.modalidade === "futsal" ? "Futsal" : "Campo"}
                      </Badge>
                    )}
                  </div>
                  <span className="text-slate-500">{formatRelative(ev.inicio)}</span>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-kfc-blue-900">{ev.titulo}</h3>
                  {ev.descricao && (
                    <p className="mt-1 text-sm text-slate-600">{ev.descricao}</p>
                  )}
                  {ev.local && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin size={12} />
                      <span>{ev.local}</span>
                    </div>
                  )}

                  <div className="mt-4">
                    {user.role === "atleta" || user.role === "admin" || user.role === "comissao" ? (
                      <RsvpButtons
                        eventoId={ev.id}
                        atual={meuStatus && meuStatus !== "pendente" ? meuStatus : null}
                      />
                    ) : (
                      <p className="text-xs text-slate-500">
                        Apenas atletas confirmam presença.{" "}
                        <Link href="/conta" className="text-kfc-blue hover:underline">
                          Solicite seu vínculo na conta
                        </Link>
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
