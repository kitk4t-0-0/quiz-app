import path from 'node:path';
import babel from '@rolldown/plugin-babel';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { nitro } from 'nitro/vite';
import { defineConfig } from 'vite';

dotenv.config({
  path: path.resolve(import.meta.dirname, '.env'),
});

const config = defineConfig({
  build: {
    sourcemap: true,
    target: 'es2022',
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      srcDirectory: 'src',
      start: {
        entry: './start.tsx',
      },
      server: {
        entry: './server.ts',
      },
      router: {
        quoteStyle: 'double',
        semicolons: true,
        routeToken: 'layout',
      },
    }),
    nitro({
      compatibilityDate: 'latest',
      preset: process.env.VERCEL ? 'vercel' : 'node',
    }),
    viteReact(),
    babel({
      presets: [
        reactCompilerPreset({
          target: '19',
        }),
      ],
    }),
  ],
  optimizeDeps: {
    entries: ['src/**/*.{ts,tsx}'],
    include: ['react', 'react-dom', '@tanstack/react-router'],
  },
  ssr: {
    noExternal: [],
  },
  server: {
    allowedHosts: process.env.ALLOWED_HOSTS?.split(',') || [],
  },
});

export default config;
