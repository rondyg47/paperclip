import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, CalendarDays, Trophy, Newspaper, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { getSessionUser, isStaff } from "@/lib/auth/session";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (!isStaff(user.role)) redirect("/");

  const sections = [
    { href: "/admin/elenco", icon: <Users size={20} />, title: "Elenco", desc: "Cadastrar e editar atletas" },
    { href: "/admin/jogos", icon: <CalendarDays size={20} />, title: "Jogos", desc: "Criar partidas e registrar resultados" },
    { href: "/admin/eventos", icon: <Trophy size={20} />, title: "Convocações", desc: "Treinos, jogos e reuniões" },
    { href: "/admin/posts", icon: <Newspaper size={20} />, title: "Posts", desc: "Moderar feed público e interno" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 md:px-0">
      <PageHeader title="Painel Admin" subtitle={`Olá, ${user.apelido ?? user.nome} · ${user.role}`} />

      <div className="grid gap-3 md:grid-cols-2">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="flex items-center gap-3 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-kfc-blue text-white">
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

      <Card className="mt-6 p-4">
        <p className="text-xs text-slate-500">
          As telas de CRUD ainda estão em construção. Por enquanto, use o
          dashboard do Supabase para inserir dados nas tabelas{" "}
          <code className="rounded bg-slate-100 px-1">categorias</code>,{" "}
          <code className="rounded bg-slate-100 px-1">atletas</code>,{" "}
          <code className="rounded bg-slate-100 px-1">partidas</code> e{" "}
          <code className="rounded bg-slate-100 px-1">eventos</code>.
        </p>
      </Card>
    </div>
  );
}
