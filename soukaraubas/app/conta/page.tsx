import Link from "next/link";
import { Settings, Calendar, Heart, LogIn, ChevronRight, Shield } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { getSessionUser } from "@/lib/auth/session";
import { logout } from "@/app/auth/actions";

export const metadata = { title: "Conta" };

const roleLabels = {
  admin: { label: "Admin", tone: "orange" as const },
  comissao: { label: "Comissão", tone: "yellow" as const },
  atleta: { label: "Atleta", tone: "blue" as const },
  torcedor: { label: "Torcedor", tone: "slate" as const },
};

export default async function ContaPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4">
        <PageHeader title="Conta" />
        <Card className="p-6 text-center">
          <p className="text-sm text-slate-600">
            Entre na sua conta pra ver convocações, suas estatísticas e o feed
            interno.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-kfc-blue px-4 py-2 text-sm font-semibold text-white hover:bg-kfc-blue-700"
          >
            <LogIn size={16} /> Entrar
          </Link>
        </Card>
      </div>
    );
  }

  const role = roleLabels[user.role];
  const isStaff = user.role === "admin" || user.role === "comissao";

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-0">
      <PageHeader title="Conta" />

      <Card className="flex items-center gap-4 p-4">
        <Avatar src={user.avatar_url} alt={user.nome} size={56} />
        <div className="flex-1">
          <p className="font-semibold text-kfc-blue-900">{user.apelido ?? user.nome}</p>
          <p className="text-xs text-slate-500">{user.email}</p>
          <Badge tone={role.tone} className="mt-1 gap-1">
            {user.role === "admin" && <Shield size={10} />}
            {role.label}
          </Badge>
        </div>
      </Card>

      <div className="mt-4 grid gap-2">
        <MenuItem href="/convocacao" icon={<Calendar size={18} />} label="Minhas convocações" />
        <MenuItem href="/curtidos" icon={<Heart size={18} />} label="Posts curtidos" />
        {isStaff && (
          <MenuItem href="/admin" icon={<Shield size={18} />} label="Painel admin" />
        )}
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
    </div>
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
