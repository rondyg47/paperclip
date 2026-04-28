import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { Escudo } from "@/components/ui/Escudo";
import { getSessionUser } from "@/lib/auth/session";
import { UserMenu } from "@/components/layout/UserMenu";
import type { Club } from "@/lib/tenant/current";

export async function TenantHeader({ club }: { club: Club }) {
  const user = await getSessionUser();
  const base = `/c/${club.slug}`;

  return (
    <header
      className="sticky top-0 z-30 border-b text-white"
      style={{
        background: `linear-gradient(135deg, ${club.cores.primary} 0%, ${shade(club.cores.primary, -25)} 100%)`,
      }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href={base} className="flex items-center gap-2">
          <Escudo size={32} src={club.escudo_url} priority />
          <div className="leading-none">
            <p className="font-display text-lg tracking-wider">{club.nome.split(" ")[0].toUpperCase()}</p>
            <p className="text-[10px]" style={{ color: club.cores.secondary }}>
              {club.nome}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavItem href={base} label="Início" />
          <NavItem href={`${base}/elenco`} label="Elenco" />
          <NavItem href={`${base}/jogos`} label="Jogos" />
          <NavItem href={`${base}/feed`} label="Feed" />
          {user && <NavItem href={`${base}/convocacao`} label="Convocação" />}
        </nav>

        <div className="flex items-center gap-1">
          <button className="rounded-full p-2 hover:bg-white/10" aria-label="Buscar">
            <Search size={18} />
          </button>
          {user && (
            <button className="rounded-full p-2 hover:bg-white/10" aria-label="Notificações">
              <Bell size={18} />
            </button>
          )}
          {user ? (
            <UserMenu user={user} clubSlug={club.slug} />
          ) : (
            <Link
              href="/login"
              className="ml-1 rounded-lg px-3 py-1.5 text-xs font-bold"
              style={{
                background: club.cores.secondary,
                color: shade(club.cores.primary, -50),
              }}
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-1.5 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white"
    >
      {label}
    </Link>
  );
}

// Escurece/aclara um hex de cor por uma porcentagem (-100..100)
function shade(hex: string, pct: number) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = clamp(((num >> 16) & 0xff) + Math.round(2.55 * pct));
  const g = clamp(((num >> 8) & 0xff) + Math.round(2.55 * pct));
  const b = clamp((num & 0xff) + Math.round(2.55 * pct));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function clamp(v: number) {
  return Math.max(0, Math.min(255, v));
}
