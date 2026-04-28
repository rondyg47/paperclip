import Link from "next/link";
import { Settings, Heart, LogIn, Plus, Shield, Users, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { getSessionUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/auth/actions";
import { tenantUrl } from "@/lib/tenant/resolve";

export const metadata = { title: "Conta" };

const roleLabels = {
  admin: { label: "Admin", tone: "orange" as const },
  comissao: { label: "Comissão", tone: "yellow" as const },
  atleta: { label: "Atleta", tone: "blue" as const },
  torcedor: { label: "Torcedor", tone: "slate" as const },
};

type Membership = {
  role: "admin" | "comissao" | "atleta" | "torcedor";
  club: {
    id: string;
    slug: string;
    nome: string;
    escudo_url: string | null;
    cores: { primary: string };
  };
};

export default async function ContaPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <>
        <MarketingHeader />
        <main className="mx-auto max-w-md px-4 py-10">
          <PageHeader title="Conta" />
          <Card className="p-6 text-center">
            <p className="text-sm text-slate-600">
              Entre na sua conta pra ver seus clubes e gerenciar suas convocações.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-kfc-blue px-4 py-2 text-sm font-semibold text-white hover:bg-kfc-blue-700"
            >
              <LogIn size={16} /> Entrar
            </Link>
          </Card>
        </main>
        <Footer />
      </>
    );
  }

  // Carrega memberships do user
  const supabase = await createClient();
  const { data } = await supabase
    .from("club_memberships")
    .select("role, club:clubs(id, slug, nome, escudo_url, cores)")
    .eq("profile_id", user.id);

  const memberships = (data ?? []) as unknown as Membership[];

  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <PageHeader title="Minha conta" />

        <Card className="flex items-center gap-4 p-4">
          <Avatar src={user.avatar_url} alt={user.nome} size={56} />
          <div className="flex-1">
            <p className="font-semibold text-kfc-blue-900">
              {user.apelido ?? user.nome}
            </p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </Card>

        <h2 className="mt-8 mb-3 font-display text-xl text-kfc-blue-900">
          Meus clubes
        </h2>

        {memberships.length === 0 ? (
          <Card className="p-6 text-center">
            <Users size={28} className="mx-auto mb-2 text-slate-400" />
            <p className="text-sm text-slate-600">
              Você ainda não faz parte de nenhum clube.
            </p>
            <Link
              href="/criar-clube"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-kfc-blue px-4 py-2 text-sm font-semibold text-white hover:bg-kfc-blue-700"
            >
              <Plus size={16} /> Criar meu clube
            </Link>
          </Card>
        ) : (
          <div className="grid gap-2">
            {memberships.map((m) => (
              <ClubMembershipCard key={m.club.id} membership={m} />
            ))}
            <Link
              href="/criar-clube"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white p-4 text-sm font-semibold text-kfc-blue hover:border-kfc-blue-300 hover:bg-kfc-blue-50"
            >
              <Plus size={16} /> Criar outro clube
            </Link>
          </div>
        )}

        <div className="mt-8 grid gap-2">
          <MenuItem href="/curtidos" icon={<Heart size={18} />} label="Posts curtidos" />
          <MenuItem href="/configuracoes" icon={<Settings size={18} />} label="Configurações" />
        </div>

        <form action={logout} className="mt-6">
          <button
            type="submit"
            className="w-full rounded-lg border border-red-200 bg-white py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            Sair da conta
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}

function ClubMembershipCard({ membership }: { membership: Membership }) {
  const role = roleLabels[membership.role];
  const isStaff = membership.role === "admin" || membership.role === "comissao";

  return (
    <Card className="overflow-hidden">
      <div
        className="flex items-center gap-3 p-4"
        style={{ borderLeft: `4px solid ${membership.club.cores.primary}` }}
      >
        {membership.club.escudo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={membership.club.escudo_url}
            alt={membership.club.nome}
            className="h-12 w-12 rounded-lg object-cover"
          />
        ) : (
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg font-display text-white"
            style={{ background: membership.club.cores.primary }}
          >
            {membership.club.nome.split(" ").map((p) => p[0]).slice(0, 2).join("")}
          </div>
        )}
        <div className="flex-1">
          <p className="font-semibold text-kfc-blue-900">{membership.club.nome}</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge tone={role.tone} className="gap-1">
              {membership.role === "admin" && <Shield size={10} />}
              {role.label}
            </Badge>
            <span className="text-xs text-slate-500">
              {membership.club.slug}.myclubfc.com
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <a
            href={tenantUrl(membership.club.slug)}
            className="rounded-lg bg-kfc-blue px-3 py-1 text-xs font-semibold text-white hover:bg-kfc-blue-700"
          >
            Abrir
          </a>
          {isStaff && (
            <a
              href={tenantUrl(membership.club.slug, "/admin")}
              className="rounded-lg border border-slate-200 px-3 py-1 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Admin
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

function MenuItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link href={href}>
      <Card className="flex items-center gap-3 p-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-kfc-blue-50 text-kfc-blue">
          {icon}
        </div>
        <span className="flex-1 text-sm font-medium text-slate-700">{label}</span>
        <ChevronRight size={16} className="text-slate-400" />
      </Card>
    </Link>
  );
}
