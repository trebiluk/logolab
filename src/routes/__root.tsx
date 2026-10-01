import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppShell } from "@/components/app-shell";
import { APP_CHIP } from "@/lib/version";
import appCss from "../styles.css?url";

const APP_NAME = "BertyBot's LogoLab";
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "BertyBot's LogoLab — TechWorks shop floor for grades 6–8. How logos work: original lab brands, broken marks, joke cousins, studio games, and a brag-board high score.",
      },
      { name: "theme-color", content: "#1f4f4a" },
      { name: "color-scheme", content: "light" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: asset("favicon.svg") },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: asset("__grok/manifest.webmanifest") },
      { rel: "apple-touch-icon", href: asset("__grok/icon-180.png") },
      { rel: "stylesheet", href: asset("fonts/lab.css") },
    ],
  }),
  component: Root,
});

function Root() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <AppShell>
            <Outlet />
          </AppShell>
        </AuthProvider>
        <Scripts />
        <HubBar />
      </body>
    </html>
  );
}

/** Hub bar after paint, so it cannot rewrite the tree React just hydrated. */
function HubBar() {
  useEffect(() => {
    if (document.querySelector('script[src*="kulibert-bar.js"]')) return;
    const s = document.createElement("script");
    s.src = "/shared/kulibert-bar.js";
    s.defer = true;
    s.dataset.app = "logolab";
    s.dataset.version = APP_CHIP;
    document.body.appendChild(s);
  }, []);
  return null;
}
