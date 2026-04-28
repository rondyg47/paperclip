import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { getSessionUser } from "@/lib/auth/session";
import {
  getCurrentClub,
  getMyRoleInCurrentClub,
  isStaffRole,
} from "@/lib/tenant/current";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Admin · Elenco" };

type Atleta = {
  id: string;
  nome_completo: string;
  apelido: string | null;
  numero_camisa: number | null;
  posicao_principal: string | null;
  foto_url: string | null;
  ativo: boolean;
};

export default async function AdminElencoPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const club = await getCurrentClub();
  if (!club) notFound();

  const role = await getMyRoleInCurrentClub();
  if (!isStaffRole(role)) {
    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <p className="rounded-lg bg-red-50 p-6 text-center text-sm text-red-700">
          Apenas comissão e admin podem gerenciar o elenco.
        </p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("atletas")
    .select("id, nome_completo, apelido, numero_camisa, posicao_principal, foto_url, ativo")
    .eq("club_id", club.id)
    .order("numero_camisa", { ascending: true, nullsFirst: false });

  const atletas = (data ?? []) as unknown as Atleta[];
  const base = `/c/${club.slug}/admin`;

  return (
    <div className="mx-auto max-w-4xl px-4 md:px-0">
      <PageHeader
        title="Elenco"
        subtitle={`${atletas.length} atletas cadastrados em ${club.nome}`}
        action={
          <Link
            href={`${base}/elenco/novo`}
            className="flex items-center gap-1.5 rounded-lg bg-kfc-blue px-3 py-1.5 text-xs font-semibold text-white hover:bg-kfc-blue-700"
          >
            <Plus size={14} /> Cadastrar atleta
          </Link>
        }
      />

      {atletas.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-600">
            Nenhum atleta cadastrado ainda.
          </p>
          <Link
            href={`${base}/elenco/novo`}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-kfc-blue px-4 py-2 text-sm font-semibold text-white hover:bg-kfc-blue-700"
          >
            <Plus size={16} /> Cadastrar primeiro atleta
          </Link>
        </Card>
      ) : (
        <div className="grid gap-2 pb-6">
          {atletas.map((a) => (
            <Card key={a.id} className="flex items-center gap-3 p-3">
              <Avatar src={a.foto_url} alt={a.nome_completo} size={40} />
              <div className="flex-1">
                <p className="font-semibold text-slate-800">
                  {a.numero_camisa && <span className="font-display text-kfc-blue mr-1.5">#{a.numero_camisa}</span>}
                  {a.nome_completo}
                  {a.apelido && (
                    <span className="ml-1 text-xs text-slate-500">({a.apelido})</span>
                  )}
                </p>
                <p className="text-xs text-slate-500">{a.posicao_principal}</p>
              </div>
              {!a.ativo && <Badge tone="slate">Inativo</Badge>}
              <Link
                href={`${base}/elenco/${a.id}`}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Editar"
              >
                <Edit size={16} />
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
