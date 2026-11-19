import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { InfoPage } from "@/features/info/info-page";
import type { InfoSearch } from "@/features/info/info-page";
import { searchTypes } from "@/features/info/search";

export const Route = createFileRoute("/_tabs/info/")({
  // Query and filter in the URL, so a reload or a shared link shows the same results.
  validateSearch: z.object({
    q: z.string().optional().catch(undefined),
    type: z.enum(searchTypes).optional().catch(undefined),
  }),
  component: Info,
});

function Info() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  // Replace instead of push: back leaves the search instead of undoing it keystroke by keystroke.
  const onSearch = (next: InfoSearch) =>
    navigate({
      search: (prev) => ({ ...prev, ...next }),
      replace: true,
      resetScroll: false,
      viewTransition: false,
    });

  return <InfoPage search={search} onSearch={onSearch} />;
}
