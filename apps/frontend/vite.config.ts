import react from "@vitejs/plugin-react";
import { defineConfig, lazyPlugins } from "vite-plus";

// https://vite.dev/config/
export default defineConfig({
  plugins: lazyPlugins(() => [react()]),
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
