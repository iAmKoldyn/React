import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// еще не познал всю мощь и удобство vite
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
