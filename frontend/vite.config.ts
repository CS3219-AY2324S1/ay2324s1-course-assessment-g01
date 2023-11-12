import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/v1/questions": {
        target: "http://question-service:8080",
        secure: false,
      },
      "/api/v1/user": "http://user-service:3000",
      "/api/v1/judge": {
        target: "https://judge0-ce.p.rapidapi.com",
        changeOrigin: true,
        rewrite(path) {
          return path.replace("/api/v1/judge", "");
        },
      },
      "/api/v1/history": "http://history-service:3008",
      "/ws": {
        target: "ws://matching-service:8082",
        ws: true,
      },
      "/collab/ws": {
        target: "ws://collab-ws-server:4444",
        ws: true,
        rewrite(path) {
          return path.replace("/collab/ws", "");
        },
      },
    },
    host: "0.0.0.0",
    port: 5173,
  },
});
