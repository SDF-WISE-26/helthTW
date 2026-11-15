import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteAllData } from "./account";

export function DeleteAllData() {
  const [error, setError] = useState(false);

  async function onClick() {
    if (!confirm("Alle deine Daten werden endgültig gelöscht. Fortfahren?")) return;
    setError(false);
    try {
      await deleteAllData();
    } catch {
      setError(true);
    }
  }

  return (
    <section className="flex flex-col gap-2">
      <Button variant="destructive" onClick={onClick}>
        Alle Daten löschen
      </Button>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          Löschen hat nicht geklappt. Bitte später noch einmal versuchen.
        </p>
      )}
    </section>
  );
}
