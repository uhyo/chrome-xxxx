import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'ChromeXxxx',
      formats: ['umd'],
      fileName: () => 'bundle.js',
    },
    rollupOptions: {
      // Keep existing external files separate
      external: [],
      output: {
        globals: {},
      },
    },
    sourcemap: 'inline',
    minify: process.env.NODE_ENV === 'production',
  },

  // Configure for TypeScript
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
});