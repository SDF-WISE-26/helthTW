import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../api";
import { usersQueryOptions } from "../queries/users";
import "../App.css";

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.query({ ...usersQueryOptions, staleTime: "static" }),
  component: Index,
});

function Index() {
  const { data: users } = useSuspenseQuery(usersQueryOptions);

  const ping = useMutation({
    mutationFn: async () => {
      const res = await api.api.ping.$get();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
  });

  return (
    <main>
      <h1>helthTW</h1>
      <select>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button type="button" onClick={() => ping.mutate()} disabled={ping.isPending}>
        Ping API
      </button>
      <p className={`status ${ping.status === "success" ? "ok" : ping.status}`}>
        {ping.isIdle && "Press the button to ping the backend."}
        {ping.isPending && "Pinging…"}
        {ping.isSuccess && `API replied: ${ping.data.message}`}
        {ping.isError && `Request failed: ${ping.error.message}`}
      </p>
    </main>
  );
}
