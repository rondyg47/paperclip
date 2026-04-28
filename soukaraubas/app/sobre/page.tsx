import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Escudo } from "@/components/ui/Escudo";
import { CATEGORIAS } from "@/lib/design/tokens";

export const metadata = { title: "Sobre o clube" };

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-0">
      <PageHeader title="Sobre o KFC" subtitle="Tradição desde 2009" />

      <Card className="p-6">
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
          <Escudo size={96} />
          <div>
            <h2 className="font-display text-2xl text-kfc-blue-900">
              Karaúbas Futebol Clube
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Fundado em <strong>29 de agosto de 2009</strong>, o KFC nasceu da
              paixão pelo futebol e cresceu se tornando referência regional.
              Hoje somos {CATEGORIAS.length} categorias ativas, em duas
              modalidades — futebol de campo e futsal.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              O time Principal disputa a 2ª Divisão Municipal de Morada Nova
              jogando todos os domingos, e a Escolinha forma novos talentos pras
              categorias de base.
            </p>
          </div>
        </div>
      </Card>

      <h3 className="mt-8 mb-3 font-display text-xl text-kfc-blue-900">
        Categorias 2025
      </h3>
      <div className="grid gap-2 md:grid-cols-2">
        {CATEGORIAS.map((c) => (
          <Card key={c.slug} className="p-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-kfc-blue-900">{c.nome}</span>
              <span className="text-xs text-slate-500">
                {c.modalidades.join(" + ")}
              </span>
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
