import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const API_URL = import.meta.env.VITE_API_URL;
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
export default API_URL;