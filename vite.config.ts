import path from "path"
import tailwindcss from "@tailwindcss/vite"

import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
//  import basicSsl from '@vitejs/plugin-basic-ssl'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(), 
    // basicSsl()
  ],
  // server: { https: true },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "../berryaudio/web/www",
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  // server: {
  //   host: "localhost",
  //   port: 5173,
  //   https: {
  //     key: fs.readFileSync(path.resolve(__dirname, "localhost-key.pem")),
  //     cert: fs.readFileSync(path.resolve(__dirname, "localhost.pem")),
  //   },
  // },
})