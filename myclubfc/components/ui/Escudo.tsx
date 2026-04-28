import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface EscudoProps {
  size?: number;
  className?: string;
  priority?: boolean;
  src?: string | null;
  alt?: string;
}

/**
 * Escudo do clube. Aceita URL custom (vinda do tenant atual) ou cai
 * pro placeholder em /public/escudo.svg.
 */
export function Escudo({
  size = 64,
  className,
  priority = false,
  src,
  alt = "Escudo do clube",
}: EscudoProps) {
  const finalSrc = src && src.length > 0 ? src : "/escudo.svg";
  return (
    <Image
      src={finalSrc}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={cn("shrink-0", className)}
      unoptimized={src?.startsWith("data:") || src?.startsWith("blob:") || undefined}
    />
  );
}
