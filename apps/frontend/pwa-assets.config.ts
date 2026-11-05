import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

// Placeholder icons until there is a logo. Regenerate public/ icons after changing favicon.svg:
// vp run frontend#generate-pwa-assets
const background = { background: "#171717" };

export default defineConfig({
  headLinkOptions: { preset: "2023" },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: background },
    apple: { ...minimal2023Preset.apple, resizeOptions: background },
  },
  images: ["public/favicon.svg"],
});
