import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    build: {
        target: 'ESNext'
    },
    server: {
        proxy: {
            '/danmaku': {
                target: 'https://danmaku.qnets.cn',
                changeOrigin: true,
                ws: true,
                rewrite: (path: string) => path.replace(/^\/danmaku/, '')
            },
            '/v1': {
                target: 'http://localhost:5200',
                changeOrigin: true,
                ws: true,
                rewrite: (path: string) => path.replace(/^\/v1/, '')
            }
        }
    }
});
