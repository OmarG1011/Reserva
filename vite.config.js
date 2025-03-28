import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //  base: 'https://omarg1011.github.io/Reserva/'
  base: '/Reserva/', 
})
