import express from 'express';
import {
    getList,
    get,
    save,
    update,
    destroy,
} from '@/controllers/template.controller';

const router = express.Router();

router.get('/', getList);
router.get('/:id', get);
router.post('/', save);
router.patch('/:id', update);
router.delete('/:id', destroy);

export default router;
