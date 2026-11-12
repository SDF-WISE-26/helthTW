import { describe, expect, it } from "vite-plus/test";
import { parseHistory } from "./history.ts";

describe("parseHistory", () => {
  it("reads the history from the dispatch metadata", () => {
    const metadata = JSON.stringify({ history: [{ role: "user", content: "Hallo" }] });

    expect(parseHistory(metadata)).toEqual([{ role: "user", content: "Hallo" }]);
  });

  it("ignores missing, malformed or invalid metadata", () => {
    expect(parseHistory(undefined)).toEqual([]);
    expect(parseHistory("")).toEqual([]);
    expect(parseHistory("not json")).toEqual([]);
    expect(parseHistory(JSON.stringify({ history: "x" }))).toEqual([]);
  });

  it("drops entries with an unknown role or empty content", () => {
    const metadata = JSON.stringify({
      history: [
        { role: "system", content: "x" },
        { role: "user", content: "" },
        null,
        { role: "assistant", content: "Ok" },
      ],
    });

    expect(parseHistory(metadata)).toEqual([{ role: "assistant", content: "Ok" }]);
  });
});
