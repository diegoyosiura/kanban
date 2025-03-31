/**
 * @license MPL-2.0
 * Copyright (c) 2025 Diego Yosiura
 */

import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/js/kanban.ts'),
            name: 'KanbanComponent',
            fileName: (format) => `kanban.${format}.js`,
            formats: ['es', 'umd']
        },
        rollupOptions: {
            output: {
                assetFileNames: `kanban.css`
            }
        },
        outDir: 'dist'
    },
    plugins: [dts()],
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: ''
            }
        }
    }
});
