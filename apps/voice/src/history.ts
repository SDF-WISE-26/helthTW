export type HistoryMessage = { role: "user" | "assistant"; content: string };

/**
 * The backend puts the recent chat into the dispatch metadata, so the voice conversation
 * continues where the text chat stopped. Anything malformed is ignored.
 */
export function parseHistory(metadata: string | undefined): HistoryMessage[] {
  if (!metadata) return [];
  try {
    const history = (JSON.parse(metadata) as { history?: unknown }).history;
    if (!Array.isArray(history)) return [];
    return history.flatMap((item) => {
      const { role, content } = (item ?? {}) as Record<string, unknown>;
      return (role === "user" || role === "assistant") && typeof content === "string" && content
        ? [{ role, content }]
        : [];
    });
  } catch {
    return [];
  }
}
