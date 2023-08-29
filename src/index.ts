import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import path from 'path';

import env from '@/utils/env';
import router from '@/router';

import { setResponseHeaders, corsOptions } from '@/middlewares/cors';
import { logger } from '@/utils/logger';

let app: Express = express();

app.use(
    helmet({
        crossOriginResourcePolicy: false,
        crossOriginEmbedderPolicy: false,
    })
);
// cors
app.use(setResponseHeaders);
app.use(cors(corsOptions));

app.use(urlencoded({ extended: false }));
app.use(json({ limit: '50mb' }));

app.use(compression());
app.use(cookieParser());

app.use('/static', express.static(path.resolve(__dirname, './public')));
app = router(app);

app.listen(env.PORT, () => {
    logger.info(`App running on port ${env.PORT}`);
});
