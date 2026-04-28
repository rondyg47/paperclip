"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { Globe, Lock, Send } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { createPost, type PostState } from "@/app/feed/actions";
import type { SessionUser } from "@/lib/auth/session";

interface ComposerProps {
  user: SessionUser;
  defaultAudiencia?: "publico" | "interno";
}

export function Composer({ user, defaultAudiencia = "interno" }: ComposerProps) {
  const [state, action, pending] = useActionState<PostState, FormData>(
    createPost,
    { status: "idle" },
  );
  const [audiencia, setAudiencia] = useState<"publico" | "interno">(defaultAudiencia);
  const [conteudo, setConteudo] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Atletas só podem postar no interno
  const podePostarPublico = user.role === "admin" || user.role === "comissao";

  useEffect(() => {
    if (state.status === "ok") {
      setConteudo("");
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <Card className="p-4">
      <form ref={formRef} action={action} className="space-y-3">
        <div className="flex items-start gap-3">
          <Avatar src={user.avatar_url} alt={user.nome} size={36} />
          <textarea
            name="conteudo"
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder={
              audiencia === "interno"
                ? "Conta pra galera do KFC…"
                : "Comunicado pra torcida…"
            }
            rows={3}
            maxLength={2000}
            className="flex-1 resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-kfc-blue focus:outline-none focus:ring-2 focus:ring-kfc-blue/20"
          />
        </div>

        <input type="hidden" name="audiencia" value={audiencia} />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
            {podePostarPublico && (
              <AudienciaButton
                active={audiencia === "publico"}
                onClick={() => setAudiencia("publico")}
              >
                <Globe size={14} /> Público
              </AudienciaButton>
            )}
            <AudienciaButton
              active={audiencia === "interno"}
              onClick={() => setAudiencia("interno")}
            >
              <Lock size={14} /> Interno
            </AudienciaButton>
          </div>

          <div className="flex items-center gap-2">
            <Badge tone="slate">{conteudo.length}/2000</Badge>
            <Button
              type="submit"
              size="sm"
              loading={pending}
              disabled={conteudo.trim().length === 0}
            >
              <Send size={14} /> Publicar
            </Button>
          </div>
        </div>

        {state.status === "error" && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-700">
            {state.message}
          </p>
        )}
        {state.status === "ok" && (
          <p className="rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            Post publicado!
          </p>
        )}
      </form>
    </Card>
  );
}

function AudienciaButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
        active
          ? "bg-white text-kfc-blue-900 shadow-sm"
          : "text-slate-600 hover:text-slate-900",
      )}
    >
      {children}
    </button>
  );
}
