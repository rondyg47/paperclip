"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, CalendarDays, Newspaper, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function BottomNav() {
  const pathname = usePathname();

  // Extrai /c/<slug> do pathname pra montar links relativos ao tenant atual
  const m = pathname.match(/^\/c\/([^/]+)/);
  const base = m ? `/c/${m[1]}` : "";

  const items = [
    { href: base || "/", label: "Início", icon: Home, exact: true },
    { href: `${base}/elenco`, label: "Elenco", icon: Users },
    { href: `${base}/jogos`, label: "Jogos", icon: CalendarDays },
    { href: `${base}/feed`, label: "Feed", icon: Newspaper },
    { href: `/conta`, label: "Conta", icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href || pathname === `${href}/`
            : pathname.startsWith(href);
          return (
            <li key={label}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-medium",
                  active ? "text-kfc-blue" : "text-slate-500",
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
