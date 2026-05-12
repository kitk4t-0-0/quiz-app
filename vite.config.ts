import path from 'node:path';
import babel from '@rolldown/plugin-babel';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import legacy from '@vitejs/plugin-legacy';
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
    target: 'es2019', // Changed from es2022 for better iOS 15 compatibility
    chunkSizeWarningLimit: 1000,

    // Ensure modern syntax is transpiled for older browsers
    cssTarget: 'safari13',
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
    // legacy({
    //   targets: ["ios >= 14"],
    //   additionalModernPolyfills: ["regenerator-runtime/runtime"]
    // })
  ],
  optimizeDeps: {
    entries: ['src/**/*.{ts,tsx}'],
    include: ['react', 'react-dom', '@tanstack/react-router'],
  },
  ssr: {
    noExternal: [],
  },
  server: {
    allowedHosts: true,
  },
});

export default config;
