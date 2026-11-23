import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRouteWithContext, useMatch } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { lazy, Suspense } from "react";
import { z } from "zod";
import { AppHeader } from "@/components/layout/app-header";
import { TabBar } from "@/components/layout/tab-bar";

const ItemSheet = lazy(() =>
  import("@/features/info/item-sheet").then((module) => ({ default: module.ItemSheet })),
);

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  // `?item=<id>` opens an info item as a sheet over any screen (features/info/item-link.ts).
  validateSearch: z.object({ item: z.string().optional().catch(undefined) }),
  component: RootLayout,
});

function RootLayout() {
  // Screens under routes/_tabs/ get the tab bar.
  const tabs = useMatch({ from: "/_tabs", shouldThrow: false });
  const onboarding = useMatch({ from: "/onboarding", shouldThrow: false });
  const { item } = Route.useSearch();

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col">
      {!onboarding && <AppHeader />}
      <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4">
        <Outlet />
      </main>
      {tabs && <TabBar />}
      <Suspense fallback={null}>{item && <ItemSheet key={item} itemId={item} />}</Suspense>
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
