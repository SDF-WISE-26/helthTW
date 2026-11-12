// UI only. Knows the backend contract (POST /api/session) and the transport interface,
// nothing about LiveKit or any model.

const transports = {
  livekit: () => import("./transport-livekit.js"),
};

const statusEl = document.querySelector("#status");
const buttonEl = document.querySelector("#toggle");
const listEl = document.querySelector("#transcript");
const audioEl = document.querySelector("#remote-audio");
const lines = new Map();
let transport;
let connected = false;

function setStatus(text) {
  statusEl.textContent = text;
  connected = text === "connected" || text === "connecting";
  buttonEl.textContent = connected ? "Disconnect" : "Connect";
}

function showTranscript({ id, role, text, final }) {
  let line = lines.get(id);
  if (!line) {
    line = document.createElement("p");
    line.className = role;
    listEl.append(line);
    lines.set(id, line);
  }
  line.textContent = text;
  line.classList.toggle("interim", !final);
  line.scrollIntoView({ block: "end" });
}

async function start() {
  const response = await fetch("/api/session", { method: "POST" });
  if (!response.ok) throw new Error(`session request failed (${response.status})`);
  const session = await response.json();
  const load = transports[session.transport];
  if (!load) throw new Error(`unknown transport "${session.transport}"`);
  transport = (await load()).createTransport({ audioElement: audioEl });
  transport.on("status", setStatus);
  transport.on("transcript", showTranscript);
  await transport.connect(session);
}

buttonEl.addEventListener("click", async () => {
  try {
    if (connected) await transport.disconnect();
    else await start();
  } catch (error) {
    setStatus(`error: ${error.message}`);
  }
});
