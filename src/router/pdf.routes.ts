import express from 'express';
import { onPdfGeneration, onPdfPreview } from '@/controllers/pdf.controller';

const router = express.Router();

router.post('/generate', onPdfGeneration);
router.post('/preview', onPdfPreview);

export default router;
