import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import * as path from 'path';
import { z } from 'zod';

const EnvSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default('http://localhost:9999'),
  VITE_ENABLE_MSW: z.enum(['true', 'false']).default('true'),
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const rawEnv = loadEnv(mode, process.cwd(), '');
  const { success, data: env, error } = EnvSchema.safeParse(rawEnv);

  if (!success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
    throw new Error('Invalid environment variables');
  }

  return {
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
