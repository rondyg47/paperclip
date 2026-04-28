import Link from "next/link";
import { Escudo } from "@/components/ui/Escudo";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Club } from "@/lib/tenant/current";

interface FooterProps {
  club?: Club;
}

export function Footer({ club }: FooterProps) {
  if (!club) return <MarketingFooter />;

  const base = `/c/${club.slug}`;
  const fundado = club.fundado_em
    ? format(new Date(club.fundado_em), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : null;

  return (
    <footer className="hidden border-t border-slate-200 bg-white md:block">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Escudo size={40} src={club.escudo_url} alt={club.nome} />
          <div>
            <p className="font-display text-lg" style={{ color: club.cores.primary }}>
              {club.nome}
            </p>
            <p className="text-xs text-slate-500">
              {fundado ? `Fundado em ${fundado}` : "MyClubFC"}
              {" · "}
              <Link href="/" className="text-slate-400 hover:underline">
                feito com MyClubFC
              </Link>
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-slate-600">
          <Link href={`${base}/sobre`} className="hover:text-slate-900">Sobre o clube</Link>
          <Link href={`${base}/elenco`} className="hover:text-slate-900">Elenco</Link>
          <Link href={`${base}/jogos`} className="hover:text-slate-900">Calendário</Link>
          <Link href={`${base}/feed`} className="hover:text-slate-900">Feed</Link>
        </nav>
      </div>
    </footer>
  );
}

function MarketingFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg text-kfc-blue-900">MyClubFC</p>
          <p className="text-xs text-slate-500">O app do seu clube de futebol.</p>
        </div>
        <nav className="flex flex-wrap gap-4 text-sm text-slate-600">
          <Link href="/precos" className="hover:text-kfc-blue">Preços</Link>
          <Link href="/sobre" className="hover:text-kfc-blue">Sobre</Link>
          <Link href="/criar-clube" className="hover:text-kfc-blue">Criar clube</Link>
          <Link href="/login" className="hover:text-kfc-blue">Entrar</Link>
        </nav>
      </div>
    </footer>
  );
}
