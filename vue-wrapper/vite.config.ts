/**
 * @license MPL-2.0
 * Copyright (c) 2025 Diego Yosiura
 */
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
    root: path.resolve(__dirname),
    plugins: [vue()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname)
        }
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true
    },
    server: {
        port: 3000
    }
});