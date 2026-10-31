import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, createRootRouteWithContext, useMatch } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppHeader } from "@/components/layout/app-header";
import { TabBar } from "@/components/layout/tab-bar";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootLayout,
});

function RootLayout() {
  // Screens under routes/_tabs/ get the tab bar.
  const tabs = useMatch({ from: "/_tabs", shouldThrow: false });

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col">
      <AppHeader />
      <main className="flex flex-1 flex-col gap-3 p-4">
        <Outlet />
      </main>
      {tabs && <TabBar />}
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  );
}
