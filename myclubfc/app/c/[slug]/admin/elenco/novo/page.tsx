import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { AtletaForm } from "@/components/admin/AtletaForm";
import { getSessionUser } from "@/lib/auth/session";
import {
  getCurrentClub,
  getMyRoleInCurrentClub,
  isStaffRole,
} from "@/lib/tenant/current";

export const metadata = { title: "Novo atleta" };

export default async function NovoAtletaPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const club = await getCurrentClub();
  if (!club) notFound();

  const role = await getMyRoleInCurrentClub();
  if (!isStaffRole(role)) redirect(`/c/${club.slug}`);

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-0">
      <PageHeader
        title="Cadastrar atleta"
        action={
          <Link
            href={`/c/${club.slug}/admin/elenco`}
            className="text-xs font-semibold text-kfc-blue hover:underline"
          >
            ← Voltar
          </Link>
        }
      />
      <AtletaForm clubSlug={club.slug} />
    </div>
  );
}
