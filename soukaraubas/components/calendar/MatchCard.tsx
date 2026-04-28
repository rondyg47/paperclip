import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Escudo } from "@/components/ui/Escudo";
import { formatRelative } from "@/lib/utils/format";
import { MapPin } from "lucide-react";

interface MatchCardProps {
  categoria: string;
  modalidade: "campo" | "futsal";
  data_hora: string;
  local?: string;
  mandante: boolean;
  adversario: string;
  status: "agendada" | "em_andamento" | "finalizada" | "adiada" | "cancelada";
  gols_kfc?: number;
  gols_adversario?: number;
}

export function MatchCard(props: MatchCardProps) {
  const finalizada = props.status === "finalizada";
  const venceu =
    finalizada &&
    typeof props.gols_kfc === "number" &&
    typeof props.gols_adversario === "number" &&
    props.gols_kfc > props.gols_adversario;
  const empatou =
    finalizada && props.gols_kfc === props.gols_adversario;

  const home = props.mandante ? "KFC" : props.adversario;
  const away = props.mandante ? props.adversario : "KFC";
  const homeGols = props.mandante ? props.gols_kfc : props.gols_adversario;
  const awayGols = props.mandante ? props.gols_adversario : props.gols_kfc;

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs">
        <div className="flex items-center gap-2">
          <Badge tone="blue">{props.categoria}</Badge>
          <Badge tone={props.modalidade === "futsal" ? "orange" : "yellow"}>
            {props.modalidade === "futsal" ? "Futsal" : "Campo"}
          </Badge>
        </div>
        <span className="text-slate-500">{formatRelative(props.data_hora)}</span>
      </div>

      <div className="flex items-center justify-around p-4">
        <Team name={home} isKfc={props.mandante} />

        <div className="text-center">
          {finalizada ? (
            <>
              <p className="font-display text-3xl text-kfc-blue-900">
                {homeGols} <span className="text-slate-300">×</span> {awayGols}
              </p>
              <Badge
                className="mt-1"
                tone={venceu ? "green" : empatou ? "yellow" : "red"}
              >
                {venceu ? "Vitória" : empatou ? "Empate" : "Derrota"}
              </Badge>
            </>
          ) : (
            <>
              <p className="font-display text-2xl text-slate-400">×</p>
              <Badge tone="slate" className="mt-1">
                {props.status === "agendada" ? "Agendada" : props.status}
              </Badge>
            </>
          )}
        </div>

        <Team name={away} isKfc={!props.mandante} />
      </div>

      {props.local && (
        <div className="flex items-center gap-1.5 border-t border-slate-100 px-4 py-2 text-xs text-slate-500">
          <MapPin size={12} />
          <span>{props.local}</span>
        </div>
      )}
    </Card>
  );
}

function Team({ name, isKfc }: { name: string; isKfc: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1.5">
      {isKfc ? (
        <Escudo size={48} />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
          {name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </div>
      )}
      <p className="line-clamp-2 text-center text-xs font-semibold text-slate-700">
        {name}
      </p>
    </div>
  );
}
