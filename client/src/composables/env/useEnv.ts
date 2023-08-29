interface Env {
    ENVIRONMENT: string;
    CLIENT_URL: string;
    SERVER_URL: string;
}

const useEnv = () => {
    const env: Env = {
        ENVIRONMENT: process.env.ENVIRONMENT
            ? process.env.ENVIRONMENT
            : 'development',
        CLIENT_URL: process.env.CLIENT_URL
            ? process.env.CLIENT_URL
            : 'http://127.0.0.1:5173',
        SERVER_URL: process.env.SERVER_URL
            ? process.env.SERVER_URL
            : 'http://127.0.0.1:5000',
    };

    return { env };
};

export default useEnv;
