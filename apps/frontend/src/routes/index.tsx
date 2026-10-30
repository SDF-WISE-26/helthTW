import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/api";
import { Button } from "@/components/ui/button";
import { usersQueryOptions } from "@/queries/users";

export const Route = createFileRoute("/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.query({ ...usersQueryOptions, staleTime: "static" }),
  component: Index,
});

function Index() {
  const { data: users } = useSuspenseQuery(usersQueryOptions);

  const ping = useMutation({
    mutationFn: async () => {
      const res = await api.api.alive_ping.$get();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    },
  });

  return (
    <main className="mx-auto flex min-h-svh max-w-md flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-semibold">helthTW</h1>
      <select aria-label="User" className="rounded-md border border-input bg-background px-3 py-2">
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <Button onClick={() => ping.mutate()} disabled={ping.isPending}>
        Ping API
      </Button>
      <p className={ping.isError ? "text-destructive" : "text-muted-foreground"}>
        {ping.isIdle && "Press the button to ping the backend."}
        {ping.isPending && "Pinging…"}
        {ping.isSuccess && `API replied: ${ping.data.message}`}
        {ping.isError && `Request failed: ${ping.error.message}`}
      </p>
    </main>
  );
}
