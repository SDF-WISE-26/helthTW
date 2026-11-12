# voice-test

Throwaway browser client for the voice agent (`apps/voice`). For experiments with the team, not for `main`: delete the folder to remove it.

Use only invented scenarios. No real names, no real health data.

## Run

1. `vp run backend#dev` (creates the sessions). `apps/backend/.env` needs `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` (same project as the agent) and the usual `LLM_*` values.
2. `vp run voice#dev` (the agent) with `AGENT_NAME=helthtw-voice` set in `apps/voice/.env`.
3. `vp run voice-test#dev`, then open http://localhost:5174 and click Connect.

`BACKEND_URL` (default `http://localhost:3000`) and `PORT` (default `5174`) are optional environment variables.

`AGENT_NAME=helthtw-voice` is required here: the backend token asks for that agent by name, and an agent without a name does not get such rooms. For the LiveKit Agents Playground do the opposite and leave `AGENT_NAME` unset.

## Contract (what the client depends on)

- Backend: `POST /api/session` returns `{ transport: "<name>", ...fields }`. For `livekit`: `{ url, token }`. This server forwards it to `POST /api/v1/voice/sessions` of the backend.
- Transport (browser): a module with `createTransport({ audioElement })` returning `connect(session)`, `disconnect()` and `on(event, callback)`.
  - `status`: `"connecting" | "connected" | "disconnected" | "error: ..."`
  - `transcript`: `{ id, role: "user" | "agent", text, final }`

`public/app.js` only uses this contract. Everything LiveKit specific is in `public/transport-livekit.js`. To try another framework: add `transport-<name>.js`, register it in `transports` in `app.js`, return its name from `/api/session`.

No workspace dependency on `voice`, `backend` or `shared`; the only link is the contract above.
