import { PageHeader } from "@/components/layout/PageHeader";
import { MatchCard } from "@/components/calendar/MatchCard";
import { mockJogos } from "@/lib/mock/data";

export const metadata = { title: "Jogos" };

export default function JogosPage() {
  const proximos = mockJogos.filter((j) => j.status === "agendada");
  const finalizados = mockJogos.filter((j) => j.status === "finalizada");

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-0">
      <PageHeader
        title="Jogos"
        subtitle="Próximas partidas e últimos resultados"
      />

      <h2 className="mb-3 font-display text-lg tracking-wide text-kfc-blue-900">
        Próximos
      </h2>
      <div className="mb-8 grid gap-3">
        {proximos.length === 0 ? (
          <p className="text-sm text-slate-500">Sem jogos agendados no momento.</p>
        ) : (
          proximos.map((j) => (
            <MatchCard
              key={j.id}
              categoria={j.categoria}
              modalidade={j.modalidade}
              data_hora={j.data_hora}
              local={j.local}
              mandante={j.mandante}
              adversario={j.adversario}
              status={j.status}
            />
          ))
        )}
      </div>

      <h2 className="mb-3 font-display text-lg tracking-wide text-kfc-blue-900">
        Resultados
      </h2>
      <div className="grid gap-3 pb-6">
        {finalizados.map((j) => (
          <MatchCard
            key={j.id}
            categoria={j.categoria}
            modalidade={j.modalidade}
            data_hora={j.data_hora}
            mandante={j.mandante}
            adversario={j.adversario}
            status={j.status}
            gols_kfc={j.gols_kfc}
            gols_adversario={j.gols_adversario}
          />
        ))}
      </div>
    </div>
  );
}
