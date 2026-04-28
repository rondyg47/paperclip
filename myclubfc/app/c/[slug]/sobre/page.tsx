import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Escudo } from "@/components/ui/Escudo";
import { CATEGORIAS } from "@/lib/design/tokens";
import { getCurrentClub } from "@/lib/tenant/current";

export const metadata = { title: "Sobre o clube" };

export default async function SobrePage() {
  const club = await getCurrentClub();
  if (!club) notFound();

  const fundadoLong = club.fundado_em
    ? format(new Date(club.fundado_em), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-0">
      <PageHeader
        title={`Sobre o ${club.nome.split(" ")[0]}`}
        subtitle={club.fundado_em ? `Tradição desde ${format(new Date(club.fundado_em), "yyyy")}` : undefined}
      />

      <Card className="p-6">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          <Escudo size={96} src={club.escudo_url} alt={club.nome} />
          <div>
            <h2 className="font-display text-2xl" style={{ color: club.cores.primary }}>
              {club.nome}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {fundadoLong && (
                <>
                  Fundado em <strong>{fundadoLong}</strong>
                  {club.cidade && club.uf ? ` em ${club.cidade}/${club.uf}` : ""}.{" "}
                </>
              )}
              {club.descricao}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Hoje somos {CATEGORIAS.length} categorias ativas, em{" "}
              {club.modalidades.length === 2 ? "duas modalidades — campo e futsal" : `modalidade ${club.modalidades[0]}`}.
            </p>
          </div>
        </div>
      </Card>

      <h3 className="mt-8 mb-3 font-display text-xl" style={{ color: club.cores.primary }}>
        Categorias
      </h3>
      <div className="grid gap-2 md:grid-cols-2">
        {CATEGORIAS.map((c) => (
          <Card key={c.slug} className="p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold" style={{ color: club.cores.primary }}>
                {c.nome}
              </span>
              <span className="text-xs text-slate-500">{c.modalidades.join(" + ")}</span>
            </div>
            {c.faixa_etaria && (
              <p className="mt-0.5 text-xs text-slate-500">{c.faixa_etaria}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
