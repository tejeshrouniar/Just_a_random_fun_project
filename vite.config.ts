import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset paths keep project sites working under username.github.io/repo-name/.
  base: './',
  plugins: [react()],
});
