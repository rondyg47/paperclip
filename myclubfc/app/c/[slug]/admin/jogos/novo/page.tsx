import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { JogoForm } from "@/components/admin/JogoForm";
import { getSessionUser } from "@/lib/auth/session";
import {
  getCurrentClub,
  getMyRoleInCurrentClub,
  isStaffRole,
} from "@/lib/tenant/current";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Novo jogo" };

type Categoria = { id: string; nome: string; modalidades: ("campo" | "futsal")[] };

export default async function NovoJogoPage() {
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

  const categorias = (data ?? []) as unknown as Categoria[];

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-0">
      <PageHeader
        title="Novo jogo"
        action={
          <Link
            href={`/c/${club.slug}/admin/jogos`}
            className="text-xs font-semibold text-kfc-blue hover:underline"
          >
            ← Voltar
          </Link>
        }
      />
      <JogoForm clubSlug={club.slug} categorias={categorias} />
    </div>
  );
}
