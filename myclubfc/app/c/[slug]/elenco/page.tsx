import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoriaCard } from "@/components/squad/CategoriaCard";
import { mockCategorias } from "@/lib/mock/data";
import { getCurrentClub } from "@/lib/tenant/current";

export const metadata = { title: "Elenco" };

export default async function ElencoPage() {
  const club = await getCurrentClub();
  if (!club) notFound();

  const subtitle = `Os ${mockCategorias.length} elencos do ${club.nome.split(" ")[0]} — ${club.modalidades.join(" e ")}`;

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-0">
      <PageHeader title="Elenco" subtitle={subtitle} />

      <div className="grid gap-3 pb-6">
        {mockCategorias.map((c) => (
          <CategoriaCard
            key={c.slug}
            clubSlug={club.slug}
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
