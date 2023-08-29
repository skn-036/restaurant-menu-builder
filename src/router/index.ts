import { Express } from 'express';

import productRoutes from '@/router/product.routes';
import pdfRoutes from '@/router/pdf.routes';

const router = (app: Express): Express => {
    app.use('/api/products', productRoutes);
    app.use('/api/pdf', pdfRoutes);
    return app;
};

export default router;
