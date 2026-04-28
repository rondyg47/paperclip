/**
 * Resolução de tenant a partir do host da request.
 *
 * Estratégia:
 *   - <slug>.myclubfc.com         → tenant slug = "<slug>"
 *   - myclubfc.com / app.myclubfc.com / www.myclubfc.com → marketing (slug = null)
 *   - <slug>.localhost:3000       → tenant slug = "<slug>" (suportado por Chrome/Safari)
 *   - localhost:3000              → marketing OU NEXT_PUBLIC_DEFAULT_TENANT em dev
 */

const RESERVED_SUBDOMAINS = new Set(["www", "app", "api", "admin", "auth", "static", "cdn"]);

const ROOT_DOMAIN = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "myclubfc.com")
  .replace(/^https?:\/\//, "")
  .toLowerCase();

// Em dev (localhost), use ?tenant=<slug> ou subdomínio (kfc.localhost) pra entrar
// em um tenant. Localhost direto sempre cai no marketing.

export type TenantContext =
  | { kind: "marketing" }
  | { kind: "tenant"; slug: string };

export function resolveTenantFromHost(rawHost: string | null | undefined): TenantContext {
  if (!rawHost) return { kind: "marketing" };
  const host = rawHost.toLowerCase().replace(/:\d+$/, ""); // strip porta

  // localhost direto sem subdomínio → marketing
  if (host === "localhost" || host === "127.0.0.1") {
    return { kind: "marketing" };
  }

  const rootHost = ROOT_DOMAIN.replace(/:\d+$/, "");

  // Acesso direto ao domínio raiz → marketing
  if (host === rootHost) return { kind: "marketing" };

  // <sub>.<root>
  if (host.endsWith(`.${rootHost}`)) {
    const sub = host.slice(0, -1 * (rootHost.length + 1));
    if (RESERVED_SUBDOMAINS.has(sub)) return { kind: "marketing" };
    if (!sub.includes(".")) return { kind: "tenant", slug: sub };
  }

  // Domínio custom não reconhecido → fallback marketing
  return { kind: "marketing" };
}

export function isMarketingHost(host: string | null | undefined) {
  return resolveTenantFromHost(host).kind === "marketing";
}

export function tenantUrl(slug: string, path: string = "/") {
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${proto}://${slug}.${ROOT_DOMAIN}${path.startsWith("/") ? path : `/${path}`}`;
}

export function rootUrl(path: string = "/") {
  const proto = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${proto}://${ROOT_DOMAIN}${path.startsWith("/") ? path : `/${path}`}`;
}
