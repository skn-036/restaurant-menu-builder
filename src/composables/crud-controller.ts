import { Request, Response } from 'express';

import {
    getItemList,
    getItem,
    updateItem,
    saveItem,
    deleteItem,
} from '@/composables/json-file-crud';

const crudController = <T extends { id?: string }>(filePath: string) => {
    const getList = async (req: Request, res: Response) => {
        try {
            const items = await getItemList<T>(filePath);
            res.send(items);
        } catch (error) {
            console.log(error);
            res.send([]);
        }
    };

    const get = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const item = await getItem<T>(filePath, id);
            res.send(item);
        } catch (error) {
            res.send(null);
        }
    };

    const save = async (req: Request, res: Response) => {
        try {
            const params = req.body as T;
            const item = await saveItem(filePath, params);

            res.send(item);
        } catch (error) {
            res.send(null);
        }
    };

    const update = async (req: Request, res: Response) => {
        try {
            const params = req.body as T;
            const id = req.params.id;
            const item = await updateItem(filePath, id, params);

            res.send(item);
        } catch (error) {
            res.send(null);
        }
    };

    const destroy = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const deleted = await deleteItem(filePath, id);
            if (deleted) res.sendStatus(200);
            else res.sendStatus(404);
        } catch (error) {
            res.sendStatus(404);
        }
    };

    return {
        getList,
        get,
        save,
        update,
        destroy,
    };
};

export default crudController;
