import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    // Named entries keep dist flat: dist/index.mjs, dist/migrate.mjs, dist/voice-worker.mjs.
    entry: {
      index: "src/index.ts",
      migrate: "src/migrate.ts",
      "voice-worker": "src/modules/voice/voice.worker.ts",
    },
    dts: false,
    // @helthtw/shared is TypeScript source, Node cannot load it from node_modules, so it goes into dist.
    deps: { alwaysBundle: [/^@helthtw\/shared(\/|$)/] },
  },
});
