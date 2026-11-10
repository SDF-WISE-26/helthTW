# voice

Minimal LiveKit voice agent: ElevenLabs Scribe v2 (speech to text) -> LLM -> ElevenLabs (text to speech), Silero VAD. No guard yet.

## Run

1. Create a free LiveKit Cloud project and copy URL, API key and secret.
2. `cp .env.example .env` and fill in the values (`ELEVEN_API_KEY`, `GOOGLE_API_KEY`).
3. `vp run voice#dev`
4. Connect with the LiveKit Agents Playground (https://agents-playground.livekit.io) using the same project, then speak.
