import express from 'express';
import { get } from '@/controllers/product.controller';

const router = express.Router();

router.get('', get);

export default router;
