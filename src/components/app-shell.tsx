import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  ClipboardList,
  Home,
  Languages,
  Printer,
  Sparkles,
  Trophy,
  Type,
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { XpChip, XpToasts } from "@/components/xp-hud";
import { LESSONS, UNIT } from "@/content/unit";
import { useProgress } from "@/lib/store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/lessons", label: "Lessons", icon: BookOpen },
  { to: "/studio", label: "Studio", icon: Sparkles },
  { to: "/glossary", label: "Words", icon: Languages },
  { to: "/printables", label: "Print", icon: Printer },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
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

  useEffect(() => {
    const unsub = useProgress.persist.onFinishHydration(() => setHydrated(true));
    if (useProgress.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, [setHydrated]);

  useEffect(() => {
    document.documentElement.classList.toggle("large-type", largeType);
  }, [largeType]);

  const progress = Math.round((completed.length / LESSONS.length) * 100);

  if (printing && pathname.startsWith("/printables/") && pathname !== "/printables/") {
    return <div className="min-h-dvh bg-paper text-ink">{children}</div>;
  }

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-teal focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <header className="no-print sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-3 sm:gap-3 sm:px-4">
          <Link to="/" className="flex min-w-0 items-center gap-2 text-ink no-underline">
            <LogoMark />
            <span className="min-w-0 truncate font-display text-[15px] font-semibold tracking-tight sm:text-lg">
              <span className="sm:hidden">{UNIT.shortName}</span>
              <span className="hidden sm:inline">{UNIT.name}</span>
            </span>
          </Link>
          <XpChip />
          <div className="ml-auto flex items-center gap-1">
            <Button
              variant={spanish ? "default" : "ghost"}
              size="sm"
              onClick={() => setSpanish(!spanish)}
              aria-pressed={spanish}
              title="Spanish supports"
            >
              ES
            </Button>
            <Button
              variant={largeType ? "default" : "ghost"}
              size="icon"
              className="size-11"
              onClick={() => setLargeType(!largeType)}
              aria-pressed={largeType}
              aria-label="Larger type"
            >
              <Type className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" asChild className="hidden sm:inline-flex">
              <Link to="/teacher">
                <ClipboardList className="size-4" />
                Teacher
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

      <div className="mx-auto flex max-w-6xl">
        <nav
          className="no-print sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-48 shrink-0 flex-col gap-1 overflow-y-auto border-r border-line p-3 md:flex"
          aria-label="Primary"
        >
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-11 items-center gap-2 rounded-md px-3 text-sm no-underline",
                  active
                    ? "bg-teal text-paper"
                    : "text-ink-soft hover:bg-surface-2 focus-visible:bg-surface-2",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/score"
            aria-current={pathname === "/score" ? "page" : undefined}
            className={cn(
              "flex h-11 items-center gap-2 rounded-md px-3 text-sm no-underline",
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
            className={cn(
              "mt-auto flex h-11 items-center gap-2 rounded-md px-3 text-sm no-underline",
              pathname.startsWith("/teacher")
                ? "bg-teal text-paper"
                : "text-ink-soft hover:bg-surface-2 focus-visible:bg-surface-2",
            )}
          >
            <ClipboardList className="size-4" />
            Teacher
          </Link>
        </nav>

        <main id="main" className="min-w-0 flex-1 px-4 py-6 pb-24 md:px-8 md:pb-10">
          {children}
        </main>
      </div>

      <nav
        className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur-sm md:hidden"
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
                    "flex h-14 flex-col items-center justify-center gap-0.5 text-xs no-underline",
                    active ? "text-teal" : "text-muted",
                  )}
                >
                  <item.icon className="size-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <XpToasts />
      {role === "teacher" ? (
        <span className="sr-only">Teacher view is on</span>
      ) : null}
    </div>
  );
}

function LogoMark() {
  return (
    <svg viewBox="0 0 32 32" className="size-7 shrink-0" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#1f4f4a" />
      <path
        fill="none"
        stroke="#f3efe6"
        strokeWidth="2.4"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        d="M10 7v18M10 7h7.2c3.4 0 5.6 1.8 5.6 4.6S20.6 16 17.2 16H10M10 16h8c3.6 0 5.8 2 5.8 5s-2.2 5-5.8 5H10"
      />
    </svg>
  );
}
