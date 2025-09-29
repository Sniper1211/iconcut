// Simplified Vite configuration file (JavaScript version, avoiding TypeScript dependency issues)
export default {
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  esbuild: {
    jsx: 'automatic'
  }
}