import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { Escudo } from "@/components/ui/Escudo";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-kfc-blue-100 bg-kfc-gradient text-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Escudo size={32} priority />
          <div className="leading-none">
            <p className="font-display text-lg tracking-wider">SouKaraubas</p>
            <p className="text-[10px] text-kfc-yellow">Karaúbas FC</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavItem href="/" label="Início" />
          <NavItem href="/elenco" label="Elenco" />
          <NavItem href="/jogos" label="Jogos" />
          <NavItem href="/feed" label="Feed" />
        </nav>

        <div className="flex items-center gap-1">
          <button
            className="rounded-full p-2 hover:bg-white/10"
            aria-label="Buscar"
          >
            <Search size={18} />
          </button>
          <button
            className="rounded-full p-2 hover:bg-white/10"
            aria-label="Notificações"
          >
            <Bell size={18} />
          </button>
          <Link
            href="/login"
            className="ml-1 rounded-lg bg-kfc-yellow px-3 py-1.5 text-xs font-bold text-kfc-blue-900 hover:bg-kfc-yellow-600"
          >
            Entrar
          </Link>
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
