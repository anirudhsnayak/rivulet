import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { presencePlugin } from './server/presence'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), presencePlugin()],
})
