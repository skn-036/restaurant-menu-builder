import path from 'path';
import crudController from '@/composables/crud-controller';

import { Product } from '@/types/pdf';

const filePath = path.join(__dirname, '../data/products.json');
export const { getList, get, save, update, destroy } =
    crudController<Product>(filePath);
