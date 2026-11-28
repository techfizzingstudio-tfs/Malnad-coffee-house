import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

const staticPages = [
  "/",
  "/about",
  "/product",
  "/Explore",
  "/horeca",
  "/bulk-supply",
  "/export",
  "/contact",
  "/admin",
];

export default defineConfig({
  plugins: [
    tanstackStart(),
    nitro({
      prerender: { routes: staticPages, crawlLinks: false, failOnError: true },
    }),
    react(),
  ],
});
