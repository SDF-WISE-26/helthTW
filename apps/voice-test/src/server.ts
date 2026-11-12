import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT ?? 5174);
const BACKEND_URL = (process.env.BACKEND_URL ?? "http://localhost:3000").replace(/\/$/, "");
const PUBLIC_DIR = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const LIVEKIT_CLIENT = join(
  PUBLIC_DIR,
  "..",
  "node_modules",
  "livekit-client",
  "dist",
  "livekit-client.umd.js",
);
const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
};

/**
 * The only backend contract the browser depends on:
 *   POST /api/session -> { transport: string, ...transport specific fields }
 * This server forwards it to the real backend route (POST /api/v1/voice/sessions), so the test
 * client uses the same path as the app will. It holds no LiveKit secret.
 */
async function createSession() {
  const response = await fetch(`${BACKEND_URL}/api/v1/voice/sessions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({}),
  }).catch(() => {
    throw new Error(`backend not reachable at ${BACKEND_URL} (start it with: vp run backend#dev)`);
  });
  if (!response.ok) {
    const error = (await response.json().catch(() => null))?.error;
    throw new Error(error?.message ?? `backend answered ${response.status}`);
  }
  return response.json();
}

createServer(async (req, res) => {
  const path = new URL(req.url ?? "/", "http://localhost").pathname;
  try {
    if (req.method === "POST" && path === "/api/session") {
      const session = JSON.stringify(await createSession());
      res.writeHead(200, { "content-type": "application/json" });
      res.end(session);
      return;
    }
    if (path === "/vendor/livekit-client.js") {
      const body = await readFile(LIVEKIT_CLIENT);
      res.writeHead(200, { "content-type": TYPES[".js"] });
      res.end(body);
      return;
    }
    const file = normalize(join(PUBLIC_DIR, path === "/" ? "index.html" : path));
    if (!file.startsWith(PUBLIC_DIR))
      throw Object.assign(new Error("forbidden"), { code: "EACCES" });
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    res.writeHead(code === "ENOENT" || code === "EACCES" ? 404 : 500, {
      "content-type": "application/json",
    });
    res.end(JSON.stringify({ error: { message: (error as Error).message } }));
  }
}).listen(PORT, () => console.log(`voice test client: http://localhost:${PORT}`));
