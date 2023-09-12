import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/v1/questions": {
        target: "http://localhost:8080",
        secure: false,
      },
      "/api/v1/user": "http://localhost:3000",
    },
    host: "0.0.0.0",
    port: 5173
  },
});
