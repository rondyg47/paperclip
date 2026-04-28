import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Tone = "blue" | "yellow" | "orange" | "green" | "red" | "slate";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  blue: "bg-kfc-blue-50 text-kfc-blue-800",
  yellow: "bg-kfc-yellow-50 text-kfc-yellow-800",
  orange: "bg-kfc-orange-50 text-kfc-orange-700",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-red-50 text-red-700",
  slate: "bg-slate-100 text-slate-700",
};

export function Badge({ tone = "blue", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
