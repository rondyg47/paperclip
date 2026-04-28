import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { resolveTenantFromHost } from "@/lib/tenant/resolve";

export async function middleware(request: NextRequest) {
  // 1) Renovação de sessão Supabase (cookies)
  const sessionResponse = await updateSession(request);

  // 2) Resolução de tenant via host
  const host = request.headers.get("host");
  const ctx = resolveTenantFromHost(host);

  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  // Override em dev: ?tenant=kfc força um slug
  const tenantOverride = url.searchParams.get("tenant");
  const slug = tenantOverride || (ctx.kind === "tenant" ? ctx.slug : null);

  // Constrói response com o header injetado
  const response = NextResponse.rewrite(rewriteUrl(url, slug, pathname), {
    headers: sessionResponse.headers,
  });

  // Propaga cookies do session refresh
  sessionResponse.cookies.getAll().forEach((c) => {
    response.cookies.set(c.name, c.value, c);
  });

  // Header lido pelos server components via getTenantSlug()
  if (slug) response.headers.set("x-tenant-slug", slug);

  return response;
}

function rewriteUrl(url: URL, slug: string | null, pathname: string) {
  // Rotas globais (auth, marketing, conta do user) não fazem rewrite
  const GLOBAL_PREFIXES = [
    "/login",
    "/signup",
    "/auth",
    "/criar-clube",
    "/precos",
    "/sobre",
    "/conta",
    "/api",
    "/_next",
    "/favicon",
  ];
  if (GLOBAL_PREFIXES.some((p) => pathname.startsWith(p))) return url;

  // Rota marketing root: deixa passar
  if (!slug) return url;

  // Já está sob /c/<slug>: deixa passar
  if (pathname.startsWith(`/c/${slug}`)) return url;

  // Reescreve para /c/<slug>/...
  url.pathname = `/c/${slug}${pathname === "/" ? "" : pathname}`;
  return url;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|json)$).*)",
  ],
};
