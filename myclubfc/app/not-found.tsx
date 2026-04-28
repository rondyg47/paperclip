import Link from "next/link";
import { Escudo } from "@/components/ui/Escudo";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <Escudo size={80} />
      <h1 className="mt-4 font-display text-4xl text-kfc-blue-900">
        Bola fora!
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        A página que você procurou não está no campo.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-kfc-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-kfc-blue-700"
      >
        Voltar pra Home
      </Link>
    </div>
  );
}
