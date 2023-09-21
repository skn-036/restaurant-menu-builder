import useEnv from '@/composables/env/useEnv';

describe('Composable useEnv test', () => {
    const { env } = useEnv();
    const { SERVER_URL, CLIENT_URL, ENVIRONMENT } = env;

    it('should have SERVER URL Defined in env', () => {
        expect(SERVER_URL).toBe(process.env.SERVER_URL);
    });

    it('should have CLIENT URL Defined in env', () => {
        expect(CLIENT_URL).toBe(process.env.CLIENT_URL);
    });

    it('should have ENVIRONMENT Defined in env', () => {
        expect(ENVIRONMENT).toBe(process.env.ENVIRONMENT);
    });
});
