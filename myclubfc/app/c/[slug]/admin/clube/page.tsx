import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { ClubeSettingsForm } from "@/components/admin/ClubeSettingsForm";
import { getSessionUser } from "@/lib/auth/session";
import { getCurrentClub, getMyRoleInCurrentClub } from "@/lib/tenant/current";

export const metadata = { title: "Configurações do clube" };

export default async function AdminClubePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const club = await getCurrentClub();
  if (!club) notFound();

  const role = await getMyRoleInCurrentClub();
  if (role !== "admin") {
    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <p className="rounded-lg bg-red-50 p-6 text-center text-sm text-red-700">
          Apenas o admin do clube pode editar essas configurações.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-0">
      <PageHeader
        title="Configurações do clube"
        subtitle={`Editando: ${club.nome}`}
        action={
          <Link
            href={`/c/${club.slug}/admin`}
            className="text-xs font-semibold text-kfc-blue hover:underline"
          >
            ← Painel admin
          </Link>
        }
      />
      <ClubeSettingsForm club={club} />
    </div>
  );
}
