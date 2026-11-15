import { defineConfig } from "vite-plus";

// Local agent, editor and MCP settings, each person keeps their own.
const localTools = [".claude/**", ".ai/**", ".idea/**", ".mcp.json"];

export default defineConfig({
  fmt: {
    ignorePatterns: ["**/routeTree.gen.ts", "apps/backend/drizzle/**", ...localTools],
  },
  staged: {
    "*": ["vp check --fix", "secretlint"],
    "*.{ts,tsx}": () => "vp test --passWithNoTests",
    "content/**": () => "vp test apps/frontend/src/features/info",
  },
  lint: {
    ignorePatterns: ["**/routeTree.gen.ts", ...localTools],
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
    },
  },
});
