import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Trophy, Target, Award } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { mockJogadores } from "@/lib/mock/data";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function JogadorPage({ params }: Props) {
  const { id } = await params;
  // No futuro: query Supabase com join em estatisticas_atleta + atleta_categorias
  const j = mockJogadores.find((x) => x.id === id);
  if (!j) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-0">
      <PageHeader
        title={j.apelido ?? j.nome}
        subtitle={`#${j.numero} · ${j.posicao} · ${j.categoria}`}
        action={
          <Link
            href={`/elenco/${j.categoria.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-xs font-semibold text-kfc-blue hover:underline"
          >
            ← Elenco
          </Link>
        }
      />

      <Card className="overflow-hidden">
        <div className="flex flex-col items-center gap-4 bg-kfc-gradient p-6 text-white md:flex-row md:items-end">
          <Avatar
            src={j.foto_url}
            alt={j.nome}
            size={120}
            className="ring-4 ring-kfc-yellow"
          />
          <div className="text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-kfc-yellow">
              {j.categoria} · #{j.numero}
            </p>
            <h2 className="font-display text-3xl">{j.nome}</h2>
            <p className="text-sm text-white/80">{j.posicao}</p>
            <div className="mt-2 flex justify-center gap-1.5 md:justify-start">
              {j.modalidades.includes("campo") && <Badge tone="yellow">Campo</Badge>}
              {j.modalidades.includes("futsal") && <Badge tone="orange">Futsal</Badge>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
          <Stat
            icon={<Calendar size={18} />}
            label="Jogos"
            value={(j.gols + j.assistencias + 4).toString()}
          />
          <Stat
            icon={<Target size={18} />}
            label="Gols"
            value={j.gols.toString()}
            tone="orange"
          />
          <Stat
            icon={<Award size={18} />}
            label="Assistências"
            value={j.assistencias.toString()}
            tone="yellow"
          />
          <Stat
            icon={<Trophy size={18} />}
            label="MVPs"
            value={Math.max(1, Math.floor(j.gols / 5)).toString()}
          />
        </div>
      </Card>

      <h3 className="mt-6 mb-3 font-display text-lg tracking-wide text-kfc-blue-900">
        Estatísticas por modalidade
      </h3>
      <div className="grid gap-3 md:grid-cols-2">
        {j.modalidades.map((m) => (
          <Card key={m} className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Badge tone={m === "futsal" ? "orange" : "yellow"}>
                {m === "futsal" ? "Futsal" : "Campo"}
              </Badge>
              <span className="text-xs text-slate-500">Temporada 2025</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <MiniStat label="Jogos" value={m === "futsal" ? "12" : "8"} />
              <MiniStat label="Gols" value={(j.gols / j.modalidades.length).toFixed(0)} />
              <MiniStat label="Assist." value={(j.assistencias / j.modalidades.length).toFixed(0)} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  tone = "blue",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "blue" | "orange" | "yellow";
}) {
  const tones = {
    blue: "bg-kfc-blue-50 text-kfc-blue",
    orange: "bg-kfc-orange-50 text-kfc-orange-700",
    yellow: "bg-kfc-yellow-50 text-kfc-yellow-700",
  };
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tones[tone]}`}>
        {icon}
      </div>
      <div>
        <p className="font-display text-2xl text-kfc-blue-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2 text-center">
      <p className="font-display text-lg text-kfc-blue-900">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  );
}
