import { defineConfig } from 'vite';
import { configDefaults } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import dotenv from 'dotenv';

// https://vitejs.dev/config/
export default defineConfig(() => {
    const isDevCommantRunOnClient: boolean =
        process.env.INIT_CWD.includes('client');

    const env = dotenv.config({
        path: path.join(
            process.env.INIT_CWD,
            `${isDevCommantRunOnClient ? '../' : ''}.env`
        ),
    });

    const frontendEnvs = ['ENVIRONMENT', 'CLIENT_URL', 'SERVER_URL'];

    const clientEnv = Object.entries(env.parsed)
        .filter(([key, _]) => frontendEnvs.includes(key))
        .reduce(
            (clientEnv, [key, value]) => ({ ...clientEnv, [key]: value }),
            {}
        );

    return {
        plugins: [vue()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        define: {
            'process.env': clientEnv,
        },
        test: {
            globals: true,
            clearMocks: true,
            environment: 'happy-dom',
            testTimeout: 20000,
        },
    };
});
