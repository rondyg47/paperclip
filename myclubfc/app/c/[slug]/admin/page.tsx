import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Users, CalendarDays, Trophy, Newspaper, ChevronRight, Settings } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { getSessionUser } from "@/lib/auth/session";
import {
  getCurrentClub,
  getMyRoleInCurrentClub,
  isStaffRole,
} from "@/lib/tenant/current";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const club = await getCurrentClub();
  if (!club) notFound();

  const role = await getMyRoleInCurrentClub();
  if (!isStaffRole(role)) redirect(`/c/${club.slug}`);

  const base = `/c/${club.slug}/admin`;
  const isAdmin = role === "admin";

  const sections = [
    {
      href: `${base}/elenco`,
      icon: <Users size={20} />,
      title: "Elenco",
      desc: "Cadastrar e editar atletas",
      tone: "blue" as const,
    },
    {
      href: `${base}/jogos`,
      icon: <CalendarDays size={20} />,
      title: "Jogos",
      desc: "Criar partidas e registrar resultados",
      tone: "yellow" as const,
    },
    {
      href: `${base}/eventos`,
      icon: <Trophy size={20} />,
      title: "Convocações",
      desc: "Treinos, jogos e reuniões com RSVP",
      tone: "orange" as const,
    },
    {
      href: `${base}/posts`,
      icon: <Newspaper size={20} />,
      title: "Posts",
      desc: "Moderar feed público e interno",
      tone: "blue" as const,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-0">
      <PageHeader
        title="Painel Admin"
        subtitle={`${club.nome} · ${role === "admin" ? "Admin" : "Comissão"}`}
      />

      <div className="grid gap-3 md:grid-cols-2">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="flex items-center gap-3 p-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg text-white"
                style={{ background: club.cores.primary }}
              >
                {s.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-kfc-blue-900">{s.title}</h3>
                <p className="text-xs text-slate-500">{s.desc}</p>
              </div>
              <ChevronRight size={18} className="text-slate-400" />
            </Card>
          </Link>
        ))}
      </div>

      {isAdmin && (
        <>
          <h2 className="mt-8 mb-3 font-display text-lg text-kfc-blue-900">
            Configurações do clube
          </h2>
          <Link href={`${base}/clube`}>
            <Card className="flex items-center gap-3 p-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg text-white"
                style={{ background: club.cores.primary }}
              >
                <Settings size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-kfc-blue-900">Identidade do clube</h3>
                <p className="text-xs text-slate-500">
                  Nome, descrição, cores, escudo, modalidades
                </p>
              </div>
              <Badge tone="orange">Admin</Badge>
              <ChevronRight size={18} className="text-slate-400" />
            </Card>
          </Link>
        </>
      )}
    </div>
  );
}
