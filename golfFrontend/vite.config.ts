import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'path'; // ✅ koristi * as path
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
