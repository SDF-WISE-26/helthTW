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
});
