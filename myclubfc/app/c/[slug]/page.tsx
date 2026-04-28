import Link from "next/link";
import { ArrowRight, Trophy, CalendarDays, Users } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
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
import { getCurrentClub } from "@/lib/tenant/current";
import { notFound } from "next/navigation";

export default async function HomePage() {
  const club = await getCurrentClub();
  if (!club) notFound();

  const base = `/c/${club.slug}`;
  const fundadoAno = club.fundado_em
    ? format(new Date(club.fundado_em), "yyyy")
    : null;
  const fundadoLong = club.fundado_em
    ? format(new Date(club.fundado_em), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:py-8">
      {/* HERO */}
      <section
        className="overflow-hidden rounded-2xl p-6 text-white shadow-kfc md:p-10"
        style={{
          background: `linear-gradient(135deg, ${club.cores.primary} 0%, ${shade(club.cores.primary, -25)} 50%, ${shade(club.cores.primary, -45)} 100%)`,
        }}
      >
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Escudo size={80} src={club.escudo_url} alt={club.nome} priority />
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: club.cores.secondary }}
              >
                {club.nome}
                {fundadoAno && ` · ${fundadoAno}`}
              </p>
              <h1 className="font-display text-4xl tracking-wide md:text-5xl">
                Sou {club.nome.split(" ")[0]}
              </h1>
              <p className="mt-1 max-w-md text-sm text-white/80">
                {club.descricao ?? `A casa digital do ${club.nome}. Acompanhe categorias, calendário, estatísticas e o feed do clube.`}
              </p>
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <Link
              href={`${base}/jogos`}
              className="rounded-lg px-5 py-2.5 text-center text-sm font-bold"
              style={{
                background: club.cores.secondary,
                color: shade(club.cores.primary, -50),
              }}
            >
              Próximos jogos
            </Link>
            <Link
              href={`${base}/elenco`}
              className="rounded-lg border border-white/30 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-white/10"
            >
              Ver elenco
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <QuickStat icon={<Users size={18} />} label="Categorias" value="8" club={club} />
        <QuickStat icon={<Trophy size={18} />} label="Modalidades" value={String(club.modalidades.length)} club={club} />
        <QuickStat icon={<CalendarDays size={18} />} label="Jogos no mês" value="12" club={club} />
        <QuickStat icon={<Users size={18} />} label="Atletas" value="160+" club={club} />
      </section>

      {/* DESTAQUES */}
      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <div>
          <SectionTitle title="Próximo jogo" href={`${base}/jogos`} club={club} />
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
          <SectionTitle title="Último resultado" href={`${base}/jogos`} club={club} />
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
        <SectionTitle title="Feed do clube" href={`${base}/feed`} club={club} />
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
          <h2 className="font-display text-2xl" style={{ color: club.cores.primary }}>
            Sobre o {club.nome}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {fundadoLong && (
              <>
                Fundado em <strong>{fundadoLong}</strong>
                {club.cidade && club.uf ? ` · ${club.cidade}/${club.uf}` : ""}.{" "}
              </>
            )}
            {club.descricao}
          </p>
        </Card>
      </section>
    </div>
  );
}

function SectionTitle({ title, href, club }: { title: string; href: string; club: { cores: { primary: string } } }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2
        className="font-display text-xl tracking-wide"
        style={{ color: club.cores.primary }}
      >
        {title}
      </h2>
      <Link
        href={href}
        className="flex items-center gap-1 text-xs font-semibold hover:opacity-80"
        style={{ color: club.cores.primary }}
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
  club,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  club: { cores: { primary: string } };
}) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div
        className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
        style={{ background: club.cores.primary }}
      >
        {icon}
      </div>
      <div>
        <p className="font-display text-2xl" style={{ color: club.cores.primary }}>
          {value}
        </p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </Card>
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
