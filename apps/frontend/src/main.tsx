import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter, useRouterState } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SplashScreen } from "./components/layout/splash-screen";
import "@fontsource-variable/inter";
import "./index.css";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  // Query owns caching, so the router should always call loaders on preload/visit.
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  defaultViewTransition: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const initialLoad = useRouterState({ router, select: (state) => !state.resolvedLocation });

  return (
    <>
      <RouterProvider router={router} />
      {initialLoad && <SplashScreen />}
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
