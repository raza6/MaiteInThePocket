import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    build: {
      outDir: 'build',
    },
    plugins: [react()],
    base: isProd ? '/app/' : '',
    resolve: {
      alias: [
        {
          find: '@bootstrap',
          replacement: path.resolve(__dirname, './node_modules/bootstrap'),
        },
      ],
    },
    server: {
      port: 3000,
      watch: true,
      open: '/app'
    }
  };
});