import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatDateTime(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
}

export function formatDateShort(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd/MM", { locale: ptBR });
}

export function formatRelative(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isToday(d)) return `Hoje, ${format(d, "HH:mm")}`;
  if (isTomorrow(d)) return `Amanhã, ${format(d, "HH:mm")}`;
  if (isYesterday(d)) return `Ontem, ${format(d, "HH:mm")}`;
  return format(d, "dd 'de' MMM, HH:mm", { locale: ptBR });
}

export function formatTimeAgo(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { locale: ptBR, addSuffix: true });
}
