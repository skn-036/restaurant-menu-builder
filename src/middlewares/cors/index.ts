import { Request, Response, NextFunction } from 'express';
import { removeLastChar } from '@/helpers/common';
import env from '@/utils/env';
import { CorsOptions } from 'cors';

export const setResponseHeaders = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (env.ENVIRONMENT === 'development') {
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', 'true');
        next();
    } else {
        const referrer = removeLastChar(req.headers.referer, '/');
        if (!referrer || !env.ALLOWED_ORIGINS.includes(referrer)) {
            res.status(404).send();
            return;
        }
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', 'true');
        next();
    }
};

export const corsOptions: CorsOptions = {
    origin: (_, callback) => {
        if (env.ENVIRONMENT === 'development') return callback(null, true);
        else {
            return callback(null, env.ALLOWED_ORIGINS);
        }
    },
    optionsSuccessStatus: 200,
};
