# 0018: Service worker with injectManifest

- **Status:** accepted · **Date:** 2026-11-02 · **Involved:** @LilGravyyyy · **Ref:** #53, #62, #68
- **Decision:** `vite-plugin-pwa` runs in `injectManifest` mode with its own `src/sw.ts`. At build time, the service worker caches the whole app shell (all chunks and icons) and answers navigations except `/api/*` with `index.html`. A new version only takes over on the next start, without `skipWaiting`. It does not cache API data. The icons are placeholders, generated from `public/favicon.svg`.
- **Why:** Push (#68) needs its own service worker. A reload in the middle of a check-in or the hard-incident flow would lose input. How info material and contacts get offline depends on the data model and belongs to #62.
- **Rejected:** `generateSW` (would need restructuring for push later). `autoUpdate` (reloads all open tabs). A "New version, reload" notice (its own UI, can be added later).
- **Caution:** Service workers only run over HTTPS or on `localhost`, on the prod-vm only with #109. The dev server has none, test with `vp run frontend#build` and `vp preview`. After changes to `favicon.svg`, regenerate the icons with `vp run frontend#generate-pwa-assets`.
