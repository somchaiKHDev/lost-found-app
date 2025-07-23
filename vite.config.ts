import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // any request to /api/* will be forwarded to your Functions emulator
      "/api": {
        // Adjust host, port, pathPrefix exactly as your emulator exposes it
        target: "http://127.0.0.1:5001",
        changeOrigin: true,
        rewrite: (path) =>
          // strip “/api” and replace with your Cloud Function path
          path.replace(/^\/api/, "/lost-found-service/us-central1/api"),
      },
    },
  },
});
