// 简化的 Vite 配置文件（JavaScript 版本，避免 TypeScript 依赖问题）
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