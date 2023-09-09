import path from 'path';
import crudController from '@/composables/crud-controller';

import { Template } from '@/types/pdf';

const filePath = path.join(__dirname, '../data/templates.json');
export const { getList, get, save, update, destroy } =
    crudController<Template>(filePath);
