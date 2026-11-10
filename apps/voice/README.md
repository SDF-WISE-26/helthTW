# voice

Minimal LiveKit voice agent: ElevenLabs Scribe v2 (speech to text) -> LLM -> ElevenLabs (text to speech), Silero VAD. No guard yet.

## Run

1. Create a free LiveKit Cloud project and copy URL, API key and secret.
2. `cp .env.example .env` and fill in the values (`ELEVEN_API_KEY`, `GOOGLE_API_KEY`).
3. `vp run voice#dev`
4. Connect with the LiveKit Agents Playground (https://agents-playground.livekit.io) using the same project, then speak.

## Swapping models

Each stage has a file in `src/providers/` (`stt.ts`, `llm.ts`, `tts.ts`) with a list of implementations. `STT_PROVIDER`, `LLM_PROVIDER` and `TTS_PROVIDER` pick one (defaults: `elevenlabs`, `gemini`, `elevenlabs`). To add a model (e.g. Piper), add an entry to the list in the matching file and set the variable. `agent.ts` stays unchanged.
