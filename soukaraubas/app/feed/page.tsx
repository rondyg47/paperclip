"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PostCard } from "@/components/feed/PostCard";
import { Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { mockPosts } from "@/lib/mock/data";

type Tab = "publico" | "interno";

export default function FeedPage() {
  const [tab, setTab] = useState<Tab>("publico");
  const posts = mockPosts.filter((p) => p.audiencia === tab);

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-0">
      <PageHeader title="Feed" subtitle="Tudo que rola no KFC" />

      <div className="mb-4 flex gap-2 rounded-lg bg-slate-100 p-1">
        <TabButton active={tab === "publico"} onClick={() => setTab("publico")}>
          <Globe size={14} /> Público
        </TabButton>
        <TabButton active={tab === "interno"} onClick={() => setTab("interno")}>
          <Lock size={14} /> Interno
        </TabButton>
      </div>

      <div className="grid gap-4 pb-6">
        {posts.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            {tab === "interno"
              ? "Faça login com sua conta de atleta/comissão pra ver posts internos."
              : "Nenhum post ainda."}
          </p>
        ) : (
          posts.map((p) => (
            <PostCard
              key={p.id}
              autor={p.autor}
              audiencia={p.audiencia}
              conteudo={p.conteudo}
              created_at={p.created_at}
              curtidas={p.curtidas}
              comentarios={p.comentarios}
            />
          ))
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-semibold transition-colors",
        active
          ? "bg-white text-kfc-blue-900 shadow-sm"
          : "text-slate-600 hover:text-slate-900",
      )}
    >
      {children}
    </button>
  );
}
