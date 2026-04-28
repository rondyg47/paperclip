"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, Lock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatTimeAgo } from "@/lib/utils/format";

interface PostCardProps {
  autor: { nome: string; avatar_url?: string | null };
  audiencia: "publico" | "interno";
  conteudo: string;
  midia_url?: string | null;
  created_at: string;
  curtidas: number;
  comentarios: number;
}

export function PostCard(props: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(props.curtidas);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <Avatar src={props.autor.avatar_url} alt={props.autor.nome} size={40} />
        <div className="flex-1">
          <p className="text-sm font-semibold text-kfc-blue-900">
            {props.autor.nome}
          </p>
          <p className="text-xs text-slate-500">
            {formatTimeAgo(props.created_at)}
          </p>
        </div>
        {props.audiencia === "interno" && (
          <Badge tone="orange" className="gap-1">
            <Lock size={10} /> Interno
          </Badge>
        )}
      </div>

      {props.conteudo && (
        <p className="px-4 pb-3 text-sm leading-relaxed text-slate-800">
          {props.conteudo}
        </p>
      )}

      {props.midia_url && (
        <div className="aspect-square w-full bg-slate-100">
          {/* Imagem real entra aqui via next/image */}
        </div>
      )}

      <div className="flex items-center gap-1 border-t border-slate-100 px-2 py-2">
        <button
          onClick={() => {
            setLiked((v) => !v);
            setCount((c) => c + (liked ? -1 : 1));
          }}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm text-slate-600 hover:bg-slate-50"
        >
          <Heart
            size={18}
            className={liked ? "fill-red-500 text-red-500" : ""}
          />
          <span>{count}</span>
        </button>
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm text-slate-600 hover:bg-slate-50">
          <MessageCircle size={18} />
          <span>{props.comentarios}</span>
        </button>
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm text-slate-600 hover:bg-slate-50">
          <Share2 size={18} />
        </button>
      </div>
    </Card>
  );
}
