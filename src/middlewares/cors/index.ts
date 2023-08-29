import { Request, Response, NextFunction } from 'express';
import env from '@/utils/env';
import { CorsOptions } from 'cors';

export const setResponseHeaders = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', 'true');

    // let requestOrigins = req.headers['origin']
    //     ? req.headers['origin']
    //     : req.headers['Origin']
    //     ? req.headers['Origin']
    //     : [];

    // if (typeof requestOrigins === 'string') requestOrigins = [requestOrigins];

    // if (!requestOrigins) return next();

    // if (requestOrigins.some(origin => env.ALLOWED_ORIGINS.includes(origin))) {
    //     res.setHeader('Access-Control-Allow-Credentials', 'true');
    //     res.setHeader('Access-Control-Allow-Origin', 'true');
    // }
    next();
};

export const corsOptions: CorsOptions = {
    origin: (requestOrigin, callback) => {
        return callback(null, true);
        // if (env.ENVIRONMENT === 'development' && !requestOrigin) {
        //     callback(null, true);
        // } else if (!requestOrigin) {
        //     callback(new Error('origin header not present in the request'));
        // } else if (env.ALLOWED_ORIGINS.includes(requestOrigin)) {
        //     callback(null, true);
        // } else callback(new Error('cors error'));
    },
    optionsSuccessStatus: 200,
};
