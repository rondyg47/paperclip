import Link from "next/link";
import { Escudo } from "@/components/ui/Escudo";

export function Footer() {
  return (
    <footer className="hidden border-t border-slate-200 bg-white md:block">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Escudo size={40} />
          <div>
            <p className="font-display text-lg text-kfc-blue-900">SouKaraubas</p>
            <p className="text-xs text-slate-500">
              Karaúbas Futebol Clube · Fundado em 29 de agosto de 2009
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-slate-600">
          <Link href="/sobre" className="hover:text-kfc-blue">Sobre o clube</Link>
          <Link href="/elenco" className="hover:text-kfc-blue">Elenco</Link>
          <Link href="/jogos" className="hover:text-kfc-blue">Calendário</Link>
          <Link href="/feed" className="hover:text-kfc-blue">Feed</Link>
        </nav>
      </div>
    </footer>
  );
}
