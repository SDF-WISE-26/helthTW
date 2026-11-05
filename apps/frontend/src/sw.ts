import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

declare const self: ServiceWorkerGlobalScope;

// Caches the app shell (index.html and every chunk of the build), so the app and the emergency screen start offline.
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Client-side routes get the cached index.html. API calls never do, offline data comes with #62.
registerRoute(
  new NavigationRoute(createHandlerBoundToURL("index.html"), { denylist: [/^\/api\//] }),
);

// No skipWaiting(): a new version takes over on the next start, never in the middle of a form.
