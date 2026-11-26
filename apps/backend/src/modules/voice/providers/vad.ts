import type { VAD } from "@livekit/agents";
import * as silero from "@livekit/agents-plugin-silero";

export const loadVad = (): Promise<VAD> => silero.VAD.load({ minSilenceDuration: 300 });
