import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardList,
  Home,
  Languages,
  Menu,
  PenLine,
  Printer,
  Sparkles,
  Trophy,
  Type,
  X,
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { FloorKeys } from "@/components/floor-keys";
import { LogoMark } from "@/components/logo-mark";
import { XpChip, XpToasts } from "@/components/xp-hud";
import { LESSONS, UNIT } from "@/content/unit";
import { useProgress } from "@/lib/store";
import { useClassicTheme, useFloorHome } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { APP_CHIP, WHATS_NEW } from "@/lib/version";
import { useAlias } from "@/lib/who";

const NAV = [
  { to: "/", label: "Home", labelEs: "Inicio", icon: Home, floor: true },
  { to: "/lessons", label: "Lessons", labelEs: "Lecciones", icon: BookOpen },
  { to: "/studio", label: "Studio", labelEs: "Taller", icon: Sparkles },
  { to: "/glossary", label: "Words", labelEs: "Palabras", icon: Languages },
  { to: "/printables", label: "Print", labelEs: "Imprimir", icon: Printer },
] as const;

const LINK =
  "flex h-11 min-h-11 items-center gap-2 rounded-md px-3 text-sm no-underline";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const classic = useClassicTheme();
  const floorHome = useFloorHome();
  const printing =
    (pathname.startsWith("/printables/") && pathname !== "/printables/") ||
    pathname === "/score";
  const largeType = useProgress((s) => s.largeType);
  const spanish = useProgress((s) => s.spanish);
  const setLargeType = useProgress((s) => s.setLargeType);
  const setSpanish = useProgress((s) => s.setSpanish);
  const setHydrated = useProgress((s) => s.setHydrated);
  const completed = useProgress((s) => s.completedLessons);
  const role = useProgress((s) => s.role);
  const alias = useAlias();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  const benchLock =
    !classic && (pathname === "/bench" || (pathname === "/" && !floorHome));

  useEffect(() => {
    const unsub = useProgress.persist.onFinishHydration(() => setHydrated(true));
    if (useProgress.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, [setHydrated]);

  useEffect(() => {
    document.documentElement.classList.toggle("large-type", largeType);
  }, [largeType]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, floorHome]);

  useEffect(() => {
    if (!menuOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const progress = Math.round((completed.length / LESSONS.length) * 100);
  const say = (en: string, es: string) => (spanish ? es : en);
  const homeHref = `${import.meta.env.BASE_URL}?view=home`;

  if (printing && pathname.startsWith("/printables/") && pathname !== "/printables/") {
    return <div className="min-h-dvh bg-paper text-ink">{children}</div>;
  }

  return (
    <div
      className={cn(
        "bg-paper text-ink",
        benchLock ? "bench-locked flex h-dvh flex-col overflow-hidden" : "min-h-dvh",
      )}
      data-layout={classic ? "classic" : "bench"}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-teal focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <header className="no-print sticky top-0 z-40 shrink-0 border-b border-line bg-paper">
        <div className="flex h-14 w-full items-center gap-1 px-1">
          {classic ? null : (
            <button
              ref={menuRef}
              type="button"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-ink hover:bg-surface-2"
              aria-expanded={menuOpen}
              aria-controls="floor-drawer"
              aria-label={say("Menu", "Menú")}
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-5" />
            </button>
          )}
          <Link to="/" className="flex h-11 min-h-11 min-w-11 shrink-0 items-center gap-2 px-1 text-ink no-underline">
            <LogoMark className="size-8 shrink-0" title="" />
            <span className="min-w-0 leading-none max-[420px]:hidden">
              <span className="hidden font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-teal sm:block">
                TechWorks
              </span>
              <span className="block truncate font-display text-[15px] font-semibold tracking-tight sm:text-lg">
                <span className="sm:hidden">{UNIT.shortName}</span>
                <span className="hidden sm:inline">{UNIT.name}</span>
              </span>
            </span>
          </Link>
          <XpChip />
          {alias ? (
            <span
              data-who-alias=""
              className="max-w-[5.5rem] truncate text-sm font-medium text-ink"
              title={alias}
            >
              {alias}
            </span>
          ) : (
            <span data-who-alias="" className="sr-only">
              {say("Signed out", "Sin sesión")}
            </span>
          )}
          <span
            className="shrink-0 font-mono text-[10px] tabular-nums text-muted"
            title="Version chip"
            data-chip=""
          >
            {APP_CHIP}
          </span>
          <div className="ml-auto flex items-center gap-1">
            <Button
              variant={spanish ? "default" : "ghost"}
              size="default"
              className="min-h-11 min-w-11 px-3"
              onClick={() => setSpanish(!spanish)}
              aria-pressed={spanish}
              aria-label={spanish ? "Apoyos en español, activados" : "Spanish supports"}
              title={spanish ? "Apoyos en español" : "Spanish supports"}
            >
              ES
            </Button>
            <Button
              variant={largeType ? "default" : "ghost"}
              size="icon"
              className="size-11 min-h-11 min-w-11"
              onClick={() => setLargeType(!largeType)}
              aria-pressed={largeType}
              aria-label="Larger type"
            >
              <Type className="size-4" />
            </Button>
            <Button variant="ghost" size="default" asChild className="hidden min-h-11 sm:inline-flex">
              <Link to="/teacher">
                <ClipboardList className="size-4" />
                {say("Teacher", "Maestro")}
              </Link>
            </Button>
          </div>
        </div>
        <div className="h-0.5 bg-paper-2">
          <div
            className="h-full bg-teal transition-[width] duration-300"
            style={{ width: `${progress}%` }}
            aria-hidden
          />
        </div>
      </header>

      {classic ? null : menuOpen ? (
        <div className="fixed inset-0 z-50 flex">
          <div
            id="floor-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={say("Menu", "Menú")}
            className="flex h-full w-72 max-w-[85vw] flex-col gap-1 overflow-y-auto border-r border-line bg-paper p-3 shadow-[var(--shadow-border)]"
          >
            <button
              ref={closeRef}
              type="button"
              className="inline-flex size-11 items-center justify-center self-start rounded-md hover:bg-surface-2"
              aria-label={say("Close menu", "Cerrar menú")}
              onClick={() => {
                setMenuOpen(false);
                menuRef.current?.focus();
              }}
            >
              <X className="size-5" />
            </button>
            <p className="px-3 text-sm font-medium" data-who-alias-drawer="">
              {alias || say("This device", "Este dispositivo")}
            </p>
            <p className="px-3 text-xs text-muted">{WHATS_NEW}</p>
            <p className="px-3 font-mono text-[10px] text-muted">{APP_CHIP}</p>
            <a href={homeHref} className={cn(LINK, "text-ink-soft hover:bg-surface-2")}>
              <Home className="size-4" />
              {say("Home", "Inicio")}
            </a>
            <Link to="/bench" className={cn(LINK, "text-ink-soft hover:bg-surface-2")}>
              <PenLine className="size-4" />
              {say("Bench", "Banco")}
            </Link>
            {NAV.filter((item) => !("floor" in item && item.floor)).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(LINK, "text-ink-soft hover:bg-surface-2")}
              >
                <item.icon className="size-4" />
                {spanish ? item.labelEs : item.label}
              </Link>
            ))}
            <Link to="/score" className={cn(LINK, "text-ink-soft hover:bg-surface-2")}>
              <Trophy className="size-4" />
              Score
            </Link>
            <Link to="/teacher" className={cn(LINK, "text-ink-soft hover:bg-surface-2")}>
              <ClipboardList className="size-4" />
              {say("Teacher", "Maestro")}
            </Link>
            <Link
              to="/printables/$id"
              params={{ id: "design-brief" }}
              className={cn(LINK, "text-ink-soft hover:bg-surface-2")}
            >
              <PenLine className="size-4" />
              {say("Paper brief", "Hoja de papel")}
            </Link>
            <p className="px-3 text-sm text-ink-soft">
              {say("I chose this because ______.", "Elegí esto porque ______.")}
            </p>
            <p className="mt-auto px-3 text-xs text-muted">
              {say("On this Chromebook. Fabric.js is MIT.", "En este Chromebook. Fabric.js es MIT.")}
            </p>
          </div>
          <button
            type="button"
            className="min-h-11 min-w-11 flex-1 bg-ink/30"
            aria-label={say("Close menu", "Cerrar menú")}
            onClick={() => {
              setMenuOpen(false);
              menuRef.current?.focus();
            }}
          />
        </div>
      ) : null}

      <div
        className={cn(
          "mx-auto flex w-full max-w-6xl",
          benchLock && "min-h-0 max-w-none flex-1",
        )}
      >
        {classic ? (
          <nav
            className="no-print sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-48 shrink-0 flex-col gap-1 overflow-y-auto border-r border-line p-3 md:flex"
            aria-label="Primary"
          >
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/" && !floorHome
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Fragment key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    style={{ minHeight: 44 }}
                    className={cn(
                      LINK,
                      active
                        ? "bg-teal text-paper"
                        : "text-ink-soft hover:bg-surface-2 focus-visible:bg-surface-2",
                    )}
                  >
                    <item.icon className="size-4" />
                    {spanish ? item.labelEs : item.label}
                  </Link>
                  {item.to === "/studio" ? (
                    <Link
                      to="/bench"
                      aria-current={pathname === "/bench" ? "page" : undefined}
                      style={{ minHeight: 44 }}
                      className={cn(
                        LINK,
                        pathname === "/bench"
                          ? "bg-teal text-paper"
                          : "text-ink-soft hover:bg-surface-2 focus-visible:bg-surface-2",
                      )}
                    >
                      <PenLine className="size-4" />
                      {spanish ? "Banco" : "Bench"}
                    </Link>
                  ) : null}
                </Fragment>
              );
            })}
            <Link
              to="/score"
              aria-current={pathname === "/score" ? "page" : undefined}
              style={{ minHeight: 44 }}
              className={cn(
                LINK,
                pathname === "/score"
                  ? "bg-teal text-paper"
                  : "text-ink-soft hover:bg-surface-2 focus-visible:bg-surface-2",
              )}
            >
              <Trophy className="size-4" />
              Score
            </Link>
            <Link
              to="/teacher"
              aria-current={pathname.startsWith("/teacher") ? "page" : undefined}
              style={{ minHeight: 44 }}
              className={cn(
                "mt-auto",
                LINK,
                pathname.startsWith("/teacher")
                  ? "bg-teal text-paper"
                  : "text-ink-soft hover:bg-surface-2 focus-visible:bg-surface-2",
              )}
            >
              <ClipboardList className="size-4" />
              {say("Teacher", "Maestro")}
            </Link>
          </nav>
        ) : null}

        <main
          id="main"
          className={cn(
            "min-w-0 flex-1",
            benchLock
              ? "flex min-h-0 flex-col overflow-hidden px-1.5 py-1"
              : "px-4 py-6 md:px-8",
            classic && !benchLock && "pb-24 md:pb-10",
          )}
        >
          {children}
        </main>
      </div>

      {classic ? (
        <nav
          className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper md:hidden"
          aria-label="Primary"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <ul className="grid grid-cols-5">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex h-14 min-h-11 flex-col items-center justify-center gap-0.5 text-xs no-underline",
                      active ? "text-teal" : "text-muted",
                    )}
                  >
                    <item.icon className="size-5" />
                    {spanish ? item.labelEs : item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
      <XpToasts />
      <FloorKeys />
      {role === "teacher" ? <span className="sr-only">Teacher view is on</span> : null}
    </div>
  );
}
