import dotenv from 'dotenv';
dotenv.config();

interface Env {
    ENVIRONMENT: string;
    CLIENT_URL: string;
    SERVER_URL: string;
    PORT: string | number;
    ALLOWED_ORIGINS: string[];
}

const env: Env = {
    ENVIRONMENT: process.env.ENVIRONMENT || 'development',
    CLIENT_URL: process.env.APP_URL || 'localhost:5000',
    SERVER_URL: process.env.CLIENT_APP_URL || 'localhost:5173',
    PORT: process.env.PORT || 5000,
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',')
        : [
              'http://127.0.0.1:5173',
              'http://127.0.0.1:5000',
              'http://127.0.0.1:3000',
          ],
};

export default env;
