import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["src/index.ts", "src/migrate.ts"],
    dts: false,
    // @helthtw/shared is TypeScript source, Node cannot load it from node_modules, so it goes into dist.
    deps: { alwaysBundle: [/^@helthtw\/shared(\/|$)/] },
  },
});
