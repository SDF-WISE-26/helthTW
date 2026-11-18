# Voice

Spoken conversation with the assistant. Why it is built this way: [`2026-11-13-voice-pipeline-in-backend.md`](../decisions/2026-11-13-voice-pipeline-in-backend.md) and [`2026-11-13-guard-gateway.md`](../decisions/2026-11-13-guard-gateway.md).

## Requirements

- Proof of concept: invented scenarios only, no real health data, until a real guard exists and the GDPR review (#91) is done.
- Every sentence the assistant speaks has passed the guard, except the fixed greeting.
- The user can interrupt the assistant at any time.
- A session can continue an earlier text chat by passing its last turns.
- LiveKit only sees random room and participant names, nothing about the caller.
- No transcripts, audio or conversation content in logs. No LiveKit session recording (`record: false`, regardless of the Cloud project setting); turn detection and interruption run locally in the worker.
- The agent answers about 2 s after the user stops speaking (measured: end of turn ~0.7 s, LLM ~0.8–1.5 s, TTS ~0.1 s).

## Flow

```
client ── POST /api/v1/voice/sessions ──> backend: room + token, agent dispatch with history
client ── WebRTC (token) ──> LiveKit (Cloud or self-hosted) <── voice worker (backend, own process)
worker:  VAD + STT → gateway: input guard → LLM → output guard per sentence → TTS
```

## Endpoint

`POST /api/v1/voice/sessions` (conventions in [`backend.md`](backend.md)).

```http
POST /api/v1/voice/sessions
Content-Type: application/json

{ "messages": [{ "role": "user", "text": "…" }, { "role": "assistant", "text": "…" }] }
```

`messages` is optional: at most 4 turns of at most 500 characters each, so send the last turns of a text chat. The history travels inside the participant token, which the LiveKit client sends as a URL parameter, so it has to stay small. If the serialized history is still over 3000 bytes, the backend drops the oldest turns. The limits are in `modules/voice/voice.constants.ts`.

```http
HTTP/1.1 201 Created

{ "serverUrl": "wss://…", "participantToken": "…", "roomName": "voice-…" }
```

| Status | `code`              | When                                      |
| ------ | ------------------- | ----------------------------------------- |
| 400    | `invalid_request`   | body does not match                       |
| 503    | `voice_unavailable` | LiveKit is not configured on this backend |

The token is valid for 10 minutes and only for this one room.

## Connecting a client (for the chat UI)

`serverUrl` and `participantToken` are the fields LiveKit's client SDK expects, so the backend response can go straight into a `TokenSource`. Use `livekit-client` and, in React, `@livekit/components-react`:

```ts
import { TokenSource } from "livekit-client";
import { api } from "@/api";

const tokenSource = TokenSource.custom(async () => {
  const res = await api.api.v1.voice.sessions.$post({ json: { messages } });
  if (!res.ok) throw new Error("voice session failed");
  const { serverUrl, participantToken } = await res.json();
  return { serverUrl, participantToken };
});
// useSession(tokenSource) / <SessionProvider>, then useVoiceAssistant() for state and audio,
// useTranscriptions() for the live text of both sides.
```

What the client gets in the room:

- **Agent audio:** an audio track of the participant whose identity starts with `agent-`.
- **Transcripts:** text streams on topic `lk.transcription`, for both the user (STT) and the agent (the checked sentences). A chat UI can render them like text messages.
- **Agent state:** participant attribute `lk.agent.state` (`listening`, `thinking`, `speaking`), used by `useVoiceAssistant`.
- **Text input:** text sent on topic `lk.chat` goes through the same gateway as speech, so one session can mix typing and talking.

## Running it

- `vp run dev` starts the HTTP backend. The voice worker is separate and opt-in: `vp run backend#dev:voice`. In prod it is `node dist/voice-worker.mjs start`.
- LiveKit Cloud: set `LIVEKIT_URL`, `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` to the project values.
- Self-hosted: `docker compose --profile livekit up -d`, then `LIVEKIT_URL=ws://localhost:7880`, `LIVEKIT_API_KEY=devkey`, `LIVEKIT_API_SECRET=secret`. Nothing else changes.
- Not deployed on the HTW VMs yet. Before that: the worker service in `deploy/compose.yml` (same image, other command, around 1 GB RAM), API keys in the VM's `.env`, and network access from the prod-vm to LiveKit (WebSocket plus UDP, or TURN over TCP).

## Environment

| Variable                                               | Used by        | Default                    |
| ------------------------------------------------------ | -------------- | -------------------------- |
| `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` | API and worker | none (voice off)           |
| `ELEVENLABS_API_KEY`                                   | worker         | none (worker won't start)  |
| `VOICE_STT_PROVIDER`, `VOICE_TTS_PROVIDER`             | worker         | `elevenlabs`               |
| `VOICE_STT_LANGUAGE`                                   | worker         | `de`                       |
| `VOICE_TTS_VOICE_ID`, `VOICE_TTS_MODEL`                | worker         | a German voice, Flash v2.5 |
| `VOICE_LLM_MODEL`                                      | worker         | `LLM_MODEL`                |
| `GUARD_PROVIDER`                                       | chat and voice | `passthrough`              |

## Changing a stage

- **STT or TTS:** add an entry to `modules/voice/providers/stt.ts` or `tts.ts` and its name to the enum in `lib/env.ts`, then set the env variable.
- **LLM:** any AI SDK provider in `lib/llm.ts`. Chat and voice both follow, and LiveKit is not involved.
- **Guard:** implement `Guard` in `modules/gateway/guards/` and register it in `guards/index.ts` and `GUARD_PROVIDER`.

## Later: avatar

Not built yet. The pieces are in place:

- The gateway hands TTS one checked sentence at a time.
- ElevenLabs can return character timings (`syncAlignment`), and LiveKit passes timed text on (`TimedString`, `useTtsAlignedTranscript`).
- An avatar stage would override `ttsNode` or `transcriptionNode` in `HelthAgent` (`voice.agent.ts`). It would turn the timings into visemes or blendshapes and send them on their own text or byte stream topic (e.g. `helthtw.avatar`), synced to the audio.
- Alternatively, use a TTS provider that delivers visemes itself, through the `tts.ts` registry, or a LiveKit avatar worker that publishes video.
