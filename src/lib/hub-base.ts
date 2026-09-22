/**
 * LogoLab is mounted at https://apps.kulibert.net/logolab/.
 * The hub strips that prefix before the request reaches this app, so the
 * origin sees `/lessons` while the browser is on `/logolab/lessons`.
 *
 * Vite `base` / the router basepath use this same mount. This module puts
 * the prefix back on the request the server router matches against.
 */
export const HUB_BASE = "/logolab";

/** Static files the hub already maps onto the origin root. Leave them alone. */
const ORIGIN_STATIC_PREFIXES = ["/assets/", "/__grok/", "/fonts/"];

export function hubBaseFromRouter(routerBasepath: string | undefined): string {
  const raw = (routerBasepath ?? "").trim();
  if (!raw || raw === "/") return "";
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  return withSlash.replace(/\/+$/, "");
}

export function restoreHubBasePath(pathname: string, hubBase: string): string {
  if (!hubBase) return pathname;
  if (pathname === hubBase || pathname.startsWith(`${hubBase}/`)) return pathname;
  if (ORIGIN_STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return pathname;
  if (pathname === "/favicon.svg" || pathname === "/mark.svg" || pathname === "/og.jpg" || pathname === "/x-banner.jpg") {
    return pathname;
  }
  return `${hubBase}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

export function restoreHubBaseUrl(request: Request, routerBasepath: string | undefined): Request {
  const hubBase = hubBaseFromRouter(routerBasepath);
  if (!hubBase) return request;
  const url = new URL(request.url);
  const nextPath = restoreHubBasePath(url.pathname, hubBase);
  if (nextPath === url.pathname) return request;
  url.pathname = nextPath;
  return new Request(url, request);
}
