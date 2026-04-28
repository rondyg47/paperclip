import Link from "next/link";
import {
  Users,
  CalendarDays,
  Newspaper,
  Trophy,
  Smartphone,
  Lock,
  ArrowRight,
  Check,
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";

export default function MarketingHome() {
  return (
    <>
      <MarketingHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-kfc-blue-900 via-kfc-blue to-kfc-blue-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <div className="flex flex-col items-center text-center">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-kfc-yellow">
              SaaS para clubes de futebol amador
            </span>
            <h1 className="mt-6 font-display text-5xl tracking-wide md:text-7xl">
              O app oficial do<br />
              <span className="text-kfc-yellow">seu clube</span>, em minutos
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/80 md:text-lg">
              MyClubFC é a plataforma completa pro seu clube ter um app profissional —
              gestão de elenco, calendário de jogos, convocações, estatísticas e rede
              social interna. Campo e futsal, dos sub-12 ao Master.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/criar-clube"
                className="inline-flex items-center gap-2 rounded-lg bg-kfc-yellow px-6 py-3 text-sm font-bold text-kfc-blue-900 hover:bg-kfc-yellow-600"
              >
                Criar meu clube grátis <ArrowRight size={16} />
              </Link>
              <a
                href="http://kfc.localhost:3000/"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Ver demo do KFC
              </a>
            </div>
            <p className="mt-3 text-xs text-white/60">
              Plano grátis · sem cartão · até 100 atletas
            </p>
          </div>
        </div>

        {/* Decoração */}
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-kfc-yellow/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-kfc-orange/30 blur-3xl" />
      </section>

      {/* FEATURES */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="font-display text-3xl tracking-wide text-kfc-blue-900 md:text-4xl">
              Tudo que seu clube precisa, em um só lugar
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
              Inspirado em apps profissionais como Fla-APP, Spond e Ultrain — adaptado
              à realidade do futebol amador brasileiro.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <Feature
              icon={<Users />}
              title="Elenco organizado"
              desc="Cadastre atletas, posições, números, fotos e estatísticas. Categorias da escolinha ao Master 35, com suporte a campo e futsal simultâneos."
            />
            <Feature
              icon={<CalendarDays />}
              title="Calendário e jogos"
              desc="Próximas partidas, resultados, escalações, gols, cartões. Cada jogo com sua súmula e destaque."
            />
            <Feature
              icon={<Newspaper />}
              title="Rede social do clube"
              desc="Feed público pra torcida, feed interno só pra atletas e comissão. Stories de bastidores e momentos do clube."
            />
            <Feature
              icon={<Smartphone />}
              title="Convocação digital"
              desc="Comissão convoca pra treino e jogo, atletas confirmam presença com sim/não/talvez. Sem mais grupo de WhatsApp."
            />
            <Feature
              icon={<Trophy />}
              title="Estatísticas por modalidade"
              desc="Gols, assistências, cartões, MVPs — tudo separado por modalidade e temporada. Sub-15 que joga campo + futsal vê stats das duas."
            />
            <Feature
              icon={<Lock />}
              title="Multi-perfil seguro"
              desc="Admin, comissão, atleta e torcedor com permissões diferentes. Cada um vê o que precisa ver."
            />
          </div>
        </div>
      </section>

      {/* SHOWCASE: KFC */}
      <section className="bg-slate-50 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="rounded-full bg-kfc-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-kfc-blue">
                Cliente em destaque
              </span>
              <h2 className="mt-4 font-display text-3xl tracking-wide text-kfc-blue-900 md:text-4xl">
                Karaúbas Futebol Clube
              </h2>
              <p className="mt-3 text-slate-600">
                Fundado em 2009 em Morada Nova/CE, o KFC é o primeiro clube no MyClubFC.
                8 categorias ativas, campo e futsal, disputando a 2ª Divisão Municipal
                e formando atletas da escolinha ao profissional.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-slate-700">
                {[
                  "8 categorias gerenciadas (Sub-12, 15, 18, Master 35, Principal, Aspirantes, Escolinha, Futsal)",
                  "Calendário público com todos os jogos da temporada",
                  "Feed interno com convocações e comunicados da diretoria",
                  "Identidade visual personalizada (azul, amarelo e laranja)",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-emerald-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <a
                href="http://kfc.localhost:3000/"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-kfc-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-kfc-blue-700"
              >
                Ver app do KFC <ArrowRight size={16} />
              </a>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-kfc-blue to-kfc-blue-700 p-8 text-white shadow-card-hover">
              <div className="grid grid-cols-2 gap-4">
                <BigStat value="8" label="categorias" />
                <BigStat value="160+" label="atletas" />
                <BigStat value="2" label="modalidades" />
                <BigStat value="2009" label="desde" />
              </div>
              <p className="mt-6 text-center text-xs text-white/70">
                Karaúbas FC · Morada Nova/CE · Brasil
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-3xl tracking-wide text-kfc-blue-900 md:text-4xl">
            Seu clube na próxima temporada
          </h2>
          <p className="mt-3 text-slate-600">
            Cadastre seu clube em menos de 2 minutos. Adicione cores, escudo e
            categorias, e comece a usar de graça.
          </p>
          <Link
            href="/criar-clube"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-kfc-blue px-6 py-3 text-base font-bold text-white hover:bg-kfc-blue-700"
          >
            Criar meu clube agora <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-xl border border-slate-100 p-6 transition-shadow hover:shadow-card">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-kfc-blue text-white">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-kfc-blue-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function BigStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-4 text-center">
      <p className="font-display text-4xl text-kfc-yellow">{value}</p>
      <p className="text-xs uppercase tracking-wider text-white/70">{label}</p>
    </div>
  );
}
