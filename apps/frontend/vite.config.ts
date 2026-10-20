import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

// https://vite.dev/config/
export default defineConfig({
  // tanstackRouter must come before react()
  plugins: lazyPlugins(() => [
    tanstackRouter({ target: "react", autoCodeSplitting: true, quoteStyle: "double" }),
    react(),
  ]),
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
