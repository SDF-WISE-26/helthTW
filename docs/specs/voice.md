# Voice

Spoken conversation with the assistant in the chat, see decision `2026-11-13-voice-pipeline-in-backend.md`. Proof of concept, invented scenarios only.

- While the text field is empty, the chat offers voice mode instead of sending.
- The user can interrupt the assistant at any time and end voice mode with one tap.
- A session continues the chat with its last 4 turns (500 characters each), and spoken turns of both sides appear in the chat as text.
- The assistant answers about 2 s after the user stops speaking.
- LiveKit only sees random room and participant names. No audio, transcripts or conversation content in logs, no session recording.
- Without LiveKit configured, `POST /api/v1/voice/sessions` answers 503 (`voice_unavailable`) and the chat shows a short error.

## Known weaknesses

- Nothing checks the replies yet, so no real health data (also see the decision's Caution).
- The session route has no auth or rate limit, and every session costs LiveKit, ElevenLabs and LLM usage.
