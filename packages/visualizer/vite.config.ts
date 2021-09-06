import { defineConfig } from "vite"
import reactRefresh from "@vitejs/plugin-react-refresh"

export default defineConfig({
  plugins: [reactRefresh()],
  optimizeDeps: {
    include: ["@erml/parser"],
  },
  define: {
    "process.env": {},
  },
  build: {
    commonjsOptions: {
      exclude: ["@erml/parser"],
    },
  },
})
