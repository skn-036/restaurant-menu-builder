import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const get = async (req: Request, res: Response) => {
    try {
        const filePath = path.join(__dirname, '../data/products.json');
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        res.send(data);
    } catch (error) {
        console.log(error);
        res.send([]);
    }
};
