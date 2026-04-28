"use client";

import { useTransition } from "react";
import { Check, X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { responderRsvp } from "@/app/convocacao/actions";

type Status = "sim" | "nao" | "talvez";

interface Props {
  eventoId: string;
  atual?: Status | null;
}

export function RsvpButtons({ eventoId, atual }: Props) {
  const [pending, startTransition] = useTransition();

  function responder(status: Status) {
    const fd = new FormData();
    fd.set("evento_id", eventoId);
    fd.set("status", status);
    startTransition(async () => {
      await responderRsvp(fd);
    });
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <RsvpButton
        active={atual === "sim"}
        loading={pending}
        onClick={() => responder("sim")}
        tone="green"
        icon={<Check size={16} />}
        label="Vou"
      />
      <RsvpButton
        active={atual === "talvez"}
        loading={pending}
        onClick={() => responder("talvez")}
        tone="yellow"
        icon={<HelpCircle size={16} />}
        label="Talvez"
      />
      <RsvpButton
        active={atual === "nao"}
        loading={pending}
        onClick={() => responder("nao")}
        tone="red"
        icon={<X size={16} />}
        label="Não vou"
      />
    </div>
  );
}

const tones = {
  green: {
    active: "bg-emerald-600 text-white",
    inactive: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  },
  yellow: {
    active: "bg-kfc-yellow text-kfc-blue-900",
    inactive: "bg-kfc-yellow-50 text-kfc-yellow-800 hover:bg-kfc-yellow-100",
  },
  red: {
    active: "bg-red-600 text-white",
    inactive: "bg-red-50 text-red-700 hover:bg-red-100",
  },
} as const;

function RsvpButton({
  active,
  loading,
  onClick,
  tone,
  icon,
  label,
}: {
  active: boolean;
  loading: boolean;
  onClick: () => void;
  tone: keyof typeof tones;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={cn(
        "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-50",
        active ? tones[tone].active : tones[tone].inactive,
      )}
    >
      {icon}
      {label}
    </button>
  );
}
