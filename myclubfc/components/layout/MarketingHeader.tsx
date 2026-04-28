import Link from "next/link";
import { getSessionUser } from "@/lib/auth/session";

export async function MarketingHeader() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-kfc-blue text-white">
            <span className="font-display text-lg">M</span>
          </div>
          <span className="font-display text-xl tracking-wider text-kfc-blue-900">
            MyClubFC
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <NavItem href="/precos" label="Preços" />
          <NavItem href="/sobre" label="Sobre" />
          <a
            href="http://kfc.localhost:3000/"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Ver demo (KFC)
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link
              href="/conta"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Minha conta
            </Link>
          ) : (
            <Link
              href="/login"
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Entrar
            </Link>
          )}
          <Link
            href="/criar-clube"
            className="rounded-lg bg-kfc-blue px-4 py-1.5 text-sm font-bold text-white hover:bg-kfc-blue-700"
          >
            Criar meu clube
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
      className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    >
      {label}
    </Link>
  );
}
