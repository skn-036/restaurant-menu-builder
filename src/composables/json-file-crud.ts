import fs from 'fs';
import { createDirectory } from '@/helpers/file';

export const getItemList = async <T extends { id?: string }>(path: string) => {
    try {
        const fileContent = await fs.promises.readFile(path, 'utf-8');
        const items: T[] = JSON.parse(fileContent);
        return items;
    } catch (error) {
        return [];
    }
};

export const getItem = async <T extends { id?: string }>(
    path: string,
    id: string
) => {
    try {
        const items: T[] = await getItemList<T>(path);

        const item = items.find((i: T) => i?.id === id);
        return item ? item : null;
    } catch (error) {
        return null;
    }
};

export const saveItem = async <T extends { id?: string }>(
    path: string,
    item: T
) => {
    try {
        createDirectory(path);

        const items = await getItemList<T>(path);
        items.push(item);
        await fs.promises.writeFile(path, JSON.stringify(items, null, 2));

        return item;
    } catch (error) {
        return null;
    }
};

export const updateItem = async <T extends { id?: string }>(
    path: string,
    id: string,
    payload: T
) => {
    try {
        const items = await getItemList<T>(path);
        const item = items.find((i: T) => i?.id === id);
        if (!item) return null;

        const updatedItem = { ...item, ...payload };
        const updatedItems = items.map(i =>
            i.id === item.id ? updatedItem : i
        );

        await fs.promises.writeFile(
            path,
            JSON.stringify(updatedItems, null, 2)
        );

        return updatedItem;
    } catch (error) {
        return null;
    }
};

export const deleteItem = async <T extends { id?: string }>(
    path: string,
    id: string
) => {
    try {
        const items = await getItemList<T>(path);
        const item = items.find((i: T) => i?.id === id);
        if (!item) return true;

        const updatedItems = items.filter(i => i.id !== item.id);

        await fs.promises.writeFile(
            path,
            JSON.stringify(updatedItems, null, 2)
        );

        return true;
    } catch (error) {
        return false;
    }
};
