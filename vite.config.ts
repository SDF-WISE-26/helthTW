import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: ["**/routeTree.gen.ts", "apps/backend/drizzle/**"],
  },
  staged: {
    "*": ["vp check --fix", "secretlint"],
    "*.{ts,tsx}": () => "vp test --passWithNoTests",
  },
  lint: {
    ignorePatterns: ["**/routeTree.gen.ts"],
    plugins: ["typescript", "oxc"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
    overrides: [
      {
        files: ["apps/frontend/**"],
        plugins: ["react"],
        rules: {
          "react/rules-of-hooks": "error",
          "react/only-export-components": ["warn", { allowConstantExport: true }],
        },
      },
    ],
  },
  run: {
    cache: true,
  },
  test: {
    env: {
      LLM_BASE_URL: "http://localhost:9999/v1",
      LLM_API_KEY: "test-key",
      LLM_MODEL: "test-model",
      LIVEKIT_URL: "wss://livekit.test",
      LIVEKIT_API_KEY: "test-livekit-key",
      LIVEKIT_API_SECRET: "test-livekit-secret-0123456789abcdef",
    },
  },
});
