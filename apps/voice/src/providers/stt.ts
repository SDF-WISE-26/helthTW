import type { stt } from "@livekit/agents";
import * as elevenlabs from "@livekit/agents-plugin-elevenlabs";
import { pick } from "./registry.ts";

// To add a provider (e.g. a local faster-whisper server): add an entry here, set STT_PROVIDER.
const registry: Record<string, () => stt.STT> = {
  elevenlabs: () =>
    new elevenlabs.STT({
      model: "scribe_v2_realtime",
      languageCode: "de",
      // Let Scribe close the sentence itself after a short silence.
      serverVad: { vadSilenceThresholdSecs: 0.5 },
    }),
};

export const createStt = () => pick("STT", process.env.STT_PROVIDER ?? "elevenlabs", registry);
