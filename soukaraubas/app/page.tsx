import Link from "next/link";
import { ArrowRight, Trophy, CalendarDays, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Escudo } from "@/components/ui/Escudo";
import { MatchCard } from "@/components/calendar/MatchCard";
import { PostCard } from "@/components/feed/PostCard";
import {
  mockProximoJogo,
  mockUltimoResultado,
  mockPosts,
} from "@/lib/mock/data";
import { formatRelative } from "@/lib/utils/format";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      {/* HERO */}
      <section className="overflow-hidden rounded-2xl bg-kfc-gradient p-6 text-white shadow-kfc md:p-10">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Escudo size={80} priority />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-kfc-yellow">
                Karaúbas Futebol Clube · 2009
              </p>
              <h1 className="font-display text-4xl tracking-wide md:text-5xl">
                Sou Karaúbas
              </h1>
              <p className="mt-1 max-w-md text-sm text-white/80">
                A casa digital do KFC. Acompanhe nossas 8 categorias, calendário,
                estatísticas e o feed do clube.
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <Link
              href="/jogos"
              className="rounded-lg bg-kfc-yellow px-5 py-2.5 text-center text-sm font-bold text-kfc-blue-900 hover:bg-kfc-yellow-600"
            >
              Próximos jogos
            </Link>
            <Link
              href="/elenco"
              className="rounded-lg border border-white/30 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-white/10"
            >
              Ver elenco
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <QuickStat icon={<Users size={18} />} label="Categorias" value="8" />
        <QuickStat icon={<Trophy size={18} />} label="Modalidades" value="2" />
        <QuickStat icon={<CalendarDays size={18} />} label="Jogos no mês" value="12" />
        <QuickStat icon={<Users size={18} />} label="Atletas" value="160+" />
      </section>

      {/* DESTAQUES */}
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <SectionTitle title="Próximo jogo" href="/jogos" />
          <MatchCard
            categoria={mockProximoJogo.categoria}
            modalidade={mockProximoJogo.modalidade}
            data_hora={mockProximoJogo.data_hora}
            local={mockProximoJogo.local}
            mandante={mockProximoJogo.mandante}
            adversario={mockProximoJogo.adversario}
            status="agendada"
          />
          <p className="mt-2 text-xs text-slate-500">
            {mockProximoJogo.competicao} · Rodada {mockProximoJogo.rodada}
          </p>
        </div>

        <div>
          <SectionTitle title="Último resultado" href="/jogos" />
          <MatchCard
            categoria={mockUltimoResultado.categoria}
            modalidade={mockUltimoResultado.modalidade}
            data_hora={mockUltimoResultado.data_hora}
            mandante={mockUltimoResultado.mandante}
            adversario={mockUltimoResultado.adversario}
            status="finalizada"
            gols_kfc={mockUltimoResultado.gols_kfc}
            gols_adversario={mockUltimoResultado.gols_adversario}
          />
          {mockUltimoResultado.destaque && (
            <Card className="mt-2 flex items-center gap-2 p-3">
              <Badge tone="orange">Destaque</Badge>
              <span className="text-sm text-slate-700">
                {mockUltimoResultado.destaque}
              </span>
            </Card>
          )}
        </div>
      </section>

      {/* FEED RESUMIDO */}
      <section className="mt-10">
        <SectionTitle title="Feed do clube" href="/feed" />
        <div className="grid gap-4 md:grid-cols-2">
          {mockPosts
            .filter((p) => p.audiencia === "publico")
            .map((p) => (
              <PostCard
                key={p.id}
                autor={p.autor}
                audiencia={p.audiencia}
                conteudo={p.conteudo}
                created_at={p.created_at}
                curtidas={p.curtidas}
                comentarios={p.comentarios}
              />
            ))}
        </div>
      </section>

      {/* SOBRE */}
      <section className="mt-10">
        <Card className="p-5">
          <h2 className="font-display text-2xl text-kfc-blue-900">
            Sobre o Karaúbas FC
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Fundado em <strong>29 de agosto de 2009</strong>, o Karaúbas Futebol
            Clube nasceu da paixão pelo futebol e hoje reúne categorias da
            escolinha ao Master 35, em campo e no futsal. Disputamos a 2ª
            Divisão Municipal de Morada Nova com o time Principal e levamos a
            camisa do KFC pra muito mais lugares.
          </p>
        </Card>
      </section>
    </div>
  );
}

function SectionTitle({ title, href }: { title: string; href: string }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="font-display text-xl tracking-wide text-kfc-blue-900">
        {title}
      </h2>
      <Link
        href={href}
        className="flex items-center gap-1 text-xs font-semibold text-kfc-blue hover:text-kfc-blue-700"
      >
        Ver tudo <ArrowRight size={12} />
      </Link>
    </div>
  );
}

function QuickStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-kfc-blue-50 text-kfc-blue">
        {icon}
      </div>
      <div>
        <p className="font-display text-2xl text-kfc-blue-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </Card>
  );
}
