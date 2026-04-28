import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { PostCard } from "@/components/feed/PostCard";
import { Composer } from "@/components/feed/Composer";
import { Card } from "@/components/ui/Card";
import { Lock, Globe } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser, isMember } from "@/lib/auth/session";
import { mockPosts } from "@/lib/mock/data";

export const metadata = { title: "Feed" };

interface PageProps {
  searchParams: Promise<{ tab?: "publico" | "interno" }>;
}

type FeedPost = {
  id: string;
  conteudo: string | null;
  midia_url: string | null;
  audiencia: "publico" | "interno";
  created_at: string;
  curtidas_count: number;
  comentarios_count: number;
  autor: { nome: string; avatar_url: string | null } | null;
};

export default async function FeedPage({ searchParams }: PageProps) {
  const { tab = "publico" } = await searchParams;
  const user = await getSessionUser();

  // Se não tem Supabase configurado, cai no mock
  let posts: FeedPost[] = [];
  let usandoMock = false;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select(
        "id, conteudo, midia_url, audiencia, created_at, curtidas_count, comentarios_count, autor:profiles(nome, avatar_url)",
      )
      .eq("audiencia", tab)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      posts = data as unknown as FeedPost[];
    }
  }

  if (posts.length === 0) {
    usandoMock = true;
    posts = mockPosts
      .filter((p) => p.audiencia === tab)
      .map((p) => ({
        id: p.id,
        conteudo: p.conteudo,
        midia_url: null,
        audiencia: p.audiencia,
        created_at: p.created_at,
        curtidas_count: p.curtidas,
        comentarios_count: p.comentarios,
        autor: { nome: p.autor.nome, avatar_url: p.autor.avatar_url },
      }));
  }

  const podeVerInterno = isMember(user?.role);

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-0">
      <PageHeader title="Feed" subtitle="Tudo que rola no KFC" />

      <div className="mb-4 flex gap-2 rounded-lg bg-slate-100 p-1">
        <TabLink href="/feed?tab=publico" active={tab === "publico"}>
          <Globe size={14} /> Público
        </TabLink>
        <TabLink href="/feed?tab=interno" active={tab === "interno"}>
          <Lock size={14} /> Interno
        </TabLink>
      </div>

      {/* Composer só pra membros */}
      {user && isMember(user.role) && (
        <div className="mb-4">
          <Composer
            user={user}
            defaultAudiencia={tab === "publico" ? "publico" : "interno"}
          />
        </div>
      )}

      {/* Bloqueio se torcedor tentar ver o feed interno */}
      {tab === "interno" && !podeVerInterno && (
        <Card className="p-6 text-center">
          <Lock size={24} className="mx-auto mb-2 text-slate-400" />
          <p className="text-sm text-slate-600">
            O feed interno é exclusivo para atletas, comissão e diretoria.
          </p>
          {!user && (
            <Link
              href="/login"
              className="mt-3 inline-flex rounded-lg bg-kfc-blue px-4 py-2 text-sm font-semibold text-white hover:bg-kfc-blue-700"
            >
              Entrar com minha conta
            </Link>
          )}
        </Card>
      )}

      {(tab === "publico" || podeVerInterno) && (
        <div className="grid gap-4 pb-6">
          {posts.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Nenhum post ainda. Seja o primeiro a publicar!
            </p>
          ) : (
            posts.map((p) => (
              <PostCard
                key={p.id}
                autor={{
                  nome: p.autor?.nome ?? "Anônimo",
                  avatar_url: p.autor?.avatar_url,
                }}
                audiencia={p.audiencia}
                conteudo={p.conteudo ?? ""}
                created_at={p.created_at}
                curtidas={p.curtidas_count}
                comentarios={p.comentarios_count}
              />
            ))
          )}
          {usandoMock && (
            <p className="text-center text-[10px] text-slate-400">
              · usando dados de exemplo (Supabase ainda não configurado) ·
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function TabLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        "flex flex-1 items-center justify-center gap-1.5 rounded-md py-2 text-sm font-semibold transition-colors " +
        (active
          ? "bg-white text-kfc-blue-900 shadow-sm"
          : "text-slate-600 hover:text-slate-900")
      }
    >
      {children}
    </Link>
  );
}
