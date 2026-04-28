import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { EventoForm } from "@/components/admin/EventoForm";
import { getSessionUser } from "@/lib/auth/session";
import {
  getCurrentClub,
  getMyRoleInCurrentClub,
  isStaffRole,
} from "@/lib/tenant/current";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Nova convocação" };

type Categoria = { id: string; nome: string; modalidades: ("campo" | "futsal")[] };

export default async function NovoEventoPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const club = await getCurrentClub();
  if (!club) notFound();

  const role = await getMyRoleInCurrentClub();
  if (!isStaffRole(role)) redirect(`/c/${club.slug}`);

  const supabase = await createClient();
  const { data } = await supabase
    .from("categorias")
    .select("id, nome, modalidades")
    .eq("club_id", club.id)
    .eq("ativa", true)
    .order("ordem");

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-0">
      <PageHeader
        title="Nova convocação"
        action={
          <Link
            href={`/c/${club.slug}/admin/eventos`}
            className="text-xs font-semibold text-kfc-blue hover:underline"
          >
            ← Voltar
          </Link>
        }
      />
      <EventoForm clubSlug={club.slug} categorias={(data ?? []) as unknown as Categoria[]} />
    </div>
  );
}
