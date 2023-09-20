import { Express } from 'express';

import productRoutes from '@/router/product.routes';
import pdfRoutes from '@/router/pdf.routes';
import templateRoutes from '@/router/template.routes';

import { onPdfGeneration } from '@/controllers/pdf.controller';

const router = (app: Express): Express => {
    app.use('/api/dishes', productRoutes);
    app.use('/api/pdf', pdfRoutes);
    app.use('/api/templates', templateRoutes);
    app.post('/api/menucard', onPdfGeneration);
    app.post('/api/print', onPdfGeneration);
    return app;
};

export default router;
