import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { CATEGORIAS } from "@/lib/design/tokens";
import { mockJogadores } from "@/lib/mock/data";

interface Props {
  params: Promise<{ categoria: string }>;
}

export default async function CategoriaPage({ params }: Props) {
  const { categoria } = await params;
  const cat = CATEGORIAS.find((c) => c.slug === categoria);
  if (!cat) notFound();

  const jogadores = mockJogadores.filter((j) =>
    j.categoria.toLowerCase().replace(/\s+/g, "-") === cat.slug,
  );

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-0">
      <PageHeader
        title={cat.nome}
        subtitle={
          cat.modalidades.length > 1
            ? "Disputa campo e futsal"
            : `Modalidade: ${cat.modalidades[0]}`
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {cat.modalidades.map((m) => (
          <Badge key={m} tone={m === "futsal" ? "orange" : "yellow"}>
            {m === "futsal" ? "Futsal" : "Campo"}
          </Badge>
        ))}
        <Link
          href="/elenco"
          className="ml-auto text-xs font-semibold text-kfc-blue hover:underline"
        >
          ← Voltar pro elenco
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-6 sm:grid-cols-3 md:grid-cols-4">
        {jogadores.length === 0 ? (
          <Card className="col-span-full p-6 text-center text-sm text-slate-500">
            Elenco em montagem. Em breve atletas cadastrados aqui.
          </Card>
        ) : (
          jogadores.map((j) => (
            <Link key={j.id} href={`/jogador/${j.id}`}>
              <Card className="flex flex-col items-center p-4">
                <Avatar src={j.foto_url} alt={j.nome} size={64} />
                <div className="mt-2 flex items-center gap-1.5">
                  <span className="font-display text-lg text-kfc-blue-900">
                    #{j.numero}
                  </span>
                  <span className="text-sm font-semibold text-slate-700">
                    {j.apelido ?? j.nome.split(" ")[0]}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{j.posicao}</p>
                <div className="mt-2 flex gap-1">
                  {j.modalidades.includes("campo") && <Badge tone="yellow">Campo</Badge>}
                  {j.modalidades.includes("futsal") && <Badge tone="orange">Futsal</Badge>}
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return CATEGORIAS.map((c) => ({ categoria: c.slug }));
}
