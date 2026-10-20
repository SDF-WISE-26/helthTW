import { queryOptions } from "@tanstack/react-query";
import { api } from "../api";

export const usersQueryOptions = queryOptions({
  queryKey: ["users"],
  queryFn: async () => {
    const res = await api.api.users.$get();
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
});
