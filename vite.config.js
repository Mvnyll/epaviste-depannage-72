import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        home: resolve(projectRoot, "index.html"),
        notFound: resolve(projectRoot, "404.html"),
        legal: resolve(projectRoot, "mentions-legales.html"),
        privacy: resolve(projectRoot, "politique-confidentialite.html"),
      },
    },
  },
});
