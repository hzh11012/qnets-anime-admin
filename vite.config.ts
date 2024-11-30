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
        // 这里配置了代理，需要配合后端的set-cookie的domain
        host: '0.0.0.0',
        port: 5173,
        proxy: {
            '/v1': {
                target: 'http://localhost:5200',
                changeOrigin: true,
                ws: true,
                rewrite: (path: string) => path.replace(/^\/v1/, '')
            },
            '/auth': {
                target: 'http://localhost:4800',
                changeOrigin: true,
                ws: true,
                rewrite: (path: string) => path.replace(/^\/auth/, '')
            }
        }
    }
});
