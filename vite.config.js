import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/BeZierA_Visuals/',
  server: {
    port: 3000
  }
})