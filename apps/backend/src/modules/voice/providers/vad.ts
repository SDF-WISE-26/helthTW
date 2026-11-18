import type { VAD } from "@livekit/agents";
import * as silero from "@livekit/agents-plugin-silero";

// Voice activity detection runs locally, it notices when the user starts talking (and interrupts).
// Loaded once per worker process in prewarm, the model takes a moment.
export const loadVad = (): Promise<VAD> => silero.VAD.load({ minSilenceDuration: 300 });
