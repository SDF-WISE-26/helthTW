import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { api } from "../api";
import "../App.css";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "ok"; message: string }
  | { kind: "error"; message: string };

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    api.api.users
      .$get()
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  async function ping() {
    setStatus({ kind: "loading" });
    try {
      const res = await api.api.ping.$get();
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStatus({ kind: "ok", message: data.message });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : String(err) });
    }
  }

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
      <button type="button" onClick={ping} disabled={status.kind === "loading"}>
        Ping API
      </button>
      <p className={`status ${status.kind}`}>
        {status.kind === "idle" && "Press the button to ping the backend."}
        {status.kind === "loading" && "Pinging…"}
        {status.kind === "ok" && `API replied: ${status.message}`}
        {status.kind === "error" && `Request failed: ${status.message}`}
      </p>
    </main>
  );
}
