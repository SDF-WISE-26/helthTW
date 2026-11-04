import { useState } from "react";
import { BlobAvatar } from "./BlobAvatar.tsx";
import { useSpeech } from "./useSpeech.ts";

export default function AvatarChat() {
  const { analyser, speaking, ask } = useSpeech();
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || busy) return;
    setBusy(true);
    setReply("");
    try {
      await ask(input, setReply); // streams text + queues speech
    } finally {
      setBusy(false);
      setInput("");
    }
  }

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        gap: 16,
        padding: 24,
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <BlobAvatar analyser={analyser} simulate={speaking} thinking={busy && !speaking} size={300} />

      <p style={{ minHeight: 72, textAlign: "center", opacity: speaking ? 1 : 0.7 }}>{reply}</p>

      <form onSubmit={onSubmit} style={{ display: "flex", gap: 8, width: "100%" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something"
          style={{ flex: 1, padding: 10 }}
        />
        <button type="submit" disabled={busy}>
          Send
        </button>
      </form>
    </div>
  );
}
