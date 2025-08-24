import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr(), // tanpa option aneh-aneh
  ],
  resolve: {
    alias: { '@': '/src' },
  },
});
