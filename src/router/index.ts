import { Express } from 'express';

import productRoutes from '@/router/product.routes';
import pdfRoutes from '@/router/pdf.routes';
import templateRoutes from '@/router/template.routes';

const router = (app: Express): Express => {
    app.use('/api/products', productRoutes);
    app.use('/api/pdf', pdfRoutes);
    app.use('/api/templates', templateRoutes);
    return app;
};

export default router;
