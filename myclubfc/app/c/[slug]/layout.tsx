import { notFound } from "next/navigation";
import { TenantHeader } from "@/components/layout/TenantHeader";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { getCurrentClub } from "@/lib/tenant/current";
import { ClubThemeStyle } from "@/components/layout/ClubThemeStyle";

export default async function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const club = await getCurrentClub();
  if (!club) notFound();

  return (
    <div className="flex min-h-dvh flex-col">
      <ClubThemeStyle cores={club.cores} />
      <TenantHeader club={club} />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer club={club} />
      <BottomNav />
    </div>
  );
}
