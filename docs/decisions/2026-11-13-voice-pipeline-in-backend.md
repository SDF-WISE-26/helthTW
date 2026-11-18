# Voice pipeline with LiveKit as a second backend entrypoint

- **Status:** proposed · **Date:** 2026-11-13 · **Involved:** @xavierwelscher · **Ref:** #86
- **Decision:** Voice runs as a chain of speech to text, LLM and text to speech on LiveKit Agents for Node (`@livekit/agents`). The code lives in the backend module `modules/voice`. It runs as its own process from the same package and image (`dist/voice-worker.mjs`), next to the HTTP server. `POST /api/v1/voice/sessions` hands out a token for a fresh room and dispatches the agent by name. Each stage sits behind a small registry chosen by env (`providers/stt.ts`, `providers/tts.ts`, `providers/vad.ts`). The LLM stage is our own adapter (`providers/ai-sdk-llm.ts`): LiveKit keeps turn-taking, interruptions and history, and the reply comes from the same gateway and AI SDK model as text chat (`2026-11-13-guard-gateway.md`). For the proof of concept we use ElevenLabs (Scribe realtime, Flash TTS) and LiveKit Cloud. A self-hosted `livekit-server` only needs other `LIVEKIT_*` values, and dev compose has one under the `livekit` profile.
- **Why:** One package shares env validation, prompts, schemas, the gateway and `lib/llm.ts`, so voice can't drift from text chat. A separate process keeps audio load and crashes away from the API. `agents-js` exposes the text between the stages, which is where the guard has to sit. With the registries, changing a provider means editing one file and setting one env value.
- **Rejected:**
  - A separate `apps/voice` (the `experiment/156` route): it duplicated env, prompt and types, and needed its own Dockerfile.
  - Running the worker inside the HTTP process: audio and VAD load would share the API's event loop.
  - LiveKit's own LLM plugins: the reply would bypass the gateway and the AI SDK model.
  - Speech-to-speech models (OpenAI Realtime, Gemini Live and similar): there is no text step between hearing and speaking, so a sentence can't be checked before it is spoken.
  - Pipecat: Python only.
- **Caution:**
  - The guard is a pass-through for now. No real health data may go through it until a real guard exists and the GDPR review (#91) is done.
  - LiveKit Cloud and ElevenLabs receive the audio and text.
  - The backend image now carries the native LiveKit and ONNX dependencies. Three install scripts are allowed in `pnpm-workspace.yaml`.
  - The voice worker is not deployed yet. The prod-vm only reaches the internet through the HTW proxy, while WebRTC needs UDP or TURN to LiveKit. Changing `deploy/compose.yml` also needs a manual install (`deployment.md`).
  - The LiveKit turn detector model may only be used with LiveKit Agents (LiveKit Model License).
