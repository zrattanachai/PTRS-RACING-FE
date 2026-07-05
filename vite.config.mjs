import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
  return {
    base: './',
    build: {
      outDir: 'build',
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      port: 3000,
      proxy: {
        // for test
        '/GetAllCar': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false, // ถ้าใช้ https แล้วมีปัญหา cert ปลอม
        },
        '/ResetLambdaCount': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
        },
        '/UpdateConfig': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
        },
        '/SetDetail': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
        },
        '/Reports': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
        },
        '/CalibateGforce': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
