import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        coverage: {
            provider: 'c8', // Built-in provider
            reporter: ['text', 'json', 'html'], // Coverage formats
            all: true,
            include: ['src/**/*.{js,ts,jsx,tsx}'],
            exclude: ['node_modules', 'dist', 'test/**'],
        },
    },
});
