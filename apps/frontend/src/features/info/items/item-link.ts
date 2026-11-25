import { linkOptions, useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";

// An item opens as a sheet over the current screen: any screen, any route.
// The item is a search param (`?item=<id>`, read by the root layout), so the screen behind
// stays as it is, back closes the sheet and a link to it opens both.
export const itemLink = (itemId: string) =>
  linkOptions({
    to: ".",
    search: (prev) => ({ ...prev, item: itemId }),
    resetScroll: false,
    viewTransition: false,
  });

// Back to the screen without the sheet. A deep link has no history, so drop the param.
export function useCloseItem() {
  const router = useRouter();
  const navigate = useNavigate();
  const canGoBack = useCanGoBack();

  return () =>
    canGoBack
      ? router.history.back()
      : navigate({
          to: ".",
          search: (prev) => ({ ...prev, item: undefined }),
          replace: true,
          resetScroll: false,
          viewTransition: false,
        });
}
