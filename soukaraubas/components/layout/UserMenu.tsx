"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogOut, User as UserIcon, Shield } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { logout } from "@/app/auth/actions";
import type { SessionUser } from "@/lib/auth/session";

const roleLabels = {
  admin: "Admin",
  comissao: "Comissão",
  atleta: "Atleta",
  torcedor: "Torcedor",
} as const;

const roleTones = {
  admin: "orange",
  comissao: "yellow",
  atleta: "blue",
  torcedor: "slate",
} as const;

export function UserMenu({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="ml-1 rounded-full ring-2 ring-transparent hover:ring-kfc-yellow"
        aria-label="Menu do usuário"
      >
        <Avatar src={user.avatar_url} alt={user.nome} size={32} />
      </button>
      {open && (
        <div className="animate-fade-in absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl bg-white text-slate-800 shadow-card-hover">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="truncate text-sm font-semibold">
              {user.apelido ?? user.nome}
            </p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
            <Badge tone={roleTones[user.role]} className="mt-1.5 gap-1">
              {user.role === "admin" && <Shield size={10} />}
              {roleLabels[user.role]}
            </Badge>
          </div>
          <Link
            href="/conta"
            className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            <UserIcon size={14} /> Minha conta
          </Link>
          {(user.role === "admin" || user.role === "comissao") && (
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-slate-50"
              onClick={() => setOpen(false)}
            >
              <Shield size={14} /> Painel admin
            </Link>
          )}
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={14} /> Sair
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
