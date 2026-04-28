import { PageHeader } from "@/components/layout/PageHeader";
import { CategoriaCard } from "@/components/squad/CategoriaCard";
import { mockCategorias } from "@/lib/mock/data";

export const metadata = {
  title: "Elenco",
};

export default function ElencoPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-0">
      <PageHeader
        title="Elenco"
        subtitle="Os 8 elencos do Karaúbas FC — campo e futsal"
      />

      <div className="grid gap-3 pb-6">
        {mockCategorias.map((c) => (
          <CategoriaCard
            key={c.slug}
            slug={c.slug}
            nome={c.nome}
            modalidades={c.modalidades}
            faixa_etaria={c.faixa_etaria}
            jogadores={c.jogadores}
          />
        ))}
      </div>
    </div>
  );
}
