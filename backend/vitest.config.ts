import { defineConfig } from 'vitest/config';
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.spec.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html']
        }
    },
    plugins: [tsconfigPaths()]
});