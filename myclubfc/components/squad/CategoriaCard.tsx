import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ChevronRight, Users } from "lucide-react";

interface CategoriaCardProps {
  /** Slug do clube atual — necessário pra montar a URL do tenant */
  clubSlug: string;
  /** Slug da categoria */
  slug: string;
  nome: string;
  modalidades: readonly string[];
  faixa_etaria?: string;
  jogadores?: number;
}

export function CategoriaCard(props: CategoriaCardProps) {
  return (
    <Link href={`/c/${props.clubSlug}/elenco/${props.slug}`}>
      <Card className="flex items-center gap-3 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-kfc-blue text-white">
          <Users size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-kfc-blue-900">{props.nome}</h3>
            {props.modalidades.includes("campo") && (
              <Badge tone="yellow">Campo</Badge>
            )}
            {props.modalidades.includes("futsal") && (
              <Badge tone="orange">Futsal</Badge>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {props.faixa_etaria}
            {typeof props.jogadores === "number" && ` · ${props.jogadores} atletas`}
          </p>
        </div>
        <ChevronRight size={18} className="text-slate-400" />
      </Card>
    </Link>
  );
}
