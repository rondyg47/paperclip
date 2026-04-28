import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  Settings,
  Calendar,
  Heart,
  LogIn,
  ChevronRight,
} from "lucide-react";

export const metadata = { title: "Conta" };

export default function ContaPage() {
  // Auth real entra aqui com createClient() do Supabase
  const logado = false;

  if (!logado) {
    return (
      <div className="mx-auto max-w-md px-4">
        <PageHeader title="Conta" />
        <Card className="p-6 text-center">
          <p className="text-sm text-slate-600">
            Entre na sua conta pra ver convocações, suas estatísticas e o feed interno.
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

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-0">
      <PageHeader title="Conta" />

      <Card className="flex items-center gap-4 p-4">
        <Avatar alt="Usuário KFC" size={56} />
        <div className="flex-1">
          <p className="font-semibold text-kfc-blue-900">Nome do Usuário</p>
          <p className="text-xs text-slate-500">email@exemplo.com</p>
          <Badge tone="blue" className="mt-1">Torcedor</Badge>
        </div>
      </Card>

      <div className="mt-4 grid gap-2">
        <MenuItem href="/convocacao" icon={<Calendar size={18} />} label="Minhas convocações" />
        <MenuItem href="/curtidos" icon={<Heart size={18} />} label="Posts curtidos" />
        <MenuItem href="/configuracoes" icon={<Settings size={18} />} label="Configurações" />
      </div>
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
