import { redirect } from "next/navigation";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { CriarClubeForm } from "@/components/onboarding/CriarClubeForm";
import { getSessionUser } from "@/lib/auth/session";

export const metadata = { title: "Criar meu clube" };

export default async function CriarClubePage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/criar-clube");

  return (
    <>
      <MarketingHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <header className="mb-8 text-center">
          <h1 className="font-display text-4xl tracking-wide text-kfc-blue-900 md:text-5xl">
            Crie o app do seu clube
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-slate-600">
            Em 2 minutos seu clube tem um app profissional, com escudo, cores e
            URL próprios. Você pode personalizar tudo depois.
          </p>
        </header>
        <CriarClubeForm />
      </main>
      <Footer />
    </>
  );
}
