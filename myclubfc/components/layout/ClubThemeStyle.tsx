/**
 * Injeta CSS variables com as cores oficiais do clube atual.
 * Substitui as cores fixas do tema KFC por valores dinâmicos por tenant.
 *
 * Uso no Tailwind: bg-[var(--club-primary)], text-[var(--club-secondary)] etc.
 * Para reaproveitar as classes kfc-blue/yellow/orange existentes, exportamos
 * as três cores principais.
 */
export function ClubThemeStyle({
  cores,
}: {
  cores: { primary: string; secondary: string; accent: string };
}) {
  return (
    <style>{`
      :root {
        --club-primary: ${cores.primary};
        --club-secondary: ${cores.secondary};
        --club-accent: ${cores.accent};
      }
    `}</style>
  );
}
