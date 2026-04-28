import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface EscudoProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

/**
 * Escudo oficial do Karaúbas FC.
 * Substitua /public/escudo.png pelo arquivo oficial enviado pelo clube.
 * Enquanto isso, o fallback é o /public/escudo.svg gerado automaticamente.
 */
export function Escudo({ size = 64, className, priority = false }: EscudoProps) {
  return (
    <Image
      src="/escudo.svg"
      alt="Karaúbas Futebol Clube"
      width={size}
      height={size}
      priority={priority}
      className={cn("shrink-0", className)}
    />
  );
}
