import path from 'path';
import {
    getItemList,
    getItem,
    saveItem,
    updateItem,
    deleteItem,
} from '@/composables/json-file-crud';
import fs from 'fs';

jest.mock('fs', () => {
    const ji = jest.requireActual('fs');
    return {
        ji,
        mkdir: jest.fn(
            (
                path: string,
                opts: fs.MakeDirectoryOptions & {
                    recursive: true;
                },
                cb
            ) => cb(null)
        ),
        promises: {
            ...ji.promises,
            writeFile: jest.fn().mockImplementation((path, data) => {
                return Promise.resolve(data);
            }),
        },
    };
});

describe('Crud operation on JSON file', () => {
    const filePath = path.join(__dirname, './mocks/data.json');

    describe('Get list items from json file', () => {
        it('given valid file path should return array of items', async () => {
            const items = await getItemList(filePath);
            expect(items.length).toBe(4);
            expect(items[2].id).toBe('3');
        });

        it('given invalid file path should return empty array', async () => {
            const items = await getItemList('../hello/world');
            expect(items?.length).toBe(0);
        });
    });

    describe('Get item by id from json file', () => {
        it('given valid file path and valid id should return item', async () => {
            const item = await getItem(filePath, '2');
            expect(item?.id).toBe('2');
        });

        it('given invalid file path should return null', async () => {
            const item = await getItem('../hello/world', '1');
            expect(item).toBeNull();
        });

        it('given invalid item id should return null', async () => {
            const item = await getItem(filePath, '10');
            expect(item).toBeNull();
        });
    });

    describe('add new Item json file', () => {
        const newItem = {
            id: '5',
            name: 'Sumi',
            age: 35,
        };

        afterEach(() => {
            // @ts-ignore
            fs.promises.writeFile.mockClear();
            // @ts-ignore
            fs.mkdir.mockClear();
        });

        it('given item will be saved to json file & return the item', async () => {
            const item = await saveItem(filePath, newItem);
            expect(fs.promises.writeFile).toHaveBeenCalledTimes(1);
            expect(item?.id).toBe(newItem.id);
        });
    });

    describe('update Item json file', () => {
        const updatingItem = {
            id: '4',
            name: 'Sumi',
            age: 35,
        };

        afterEach(() => {
            // @ts-ignore
            fs.promises.writeFile.mockClear();
            // @ts-ignore
            fs.mkdir.mockClear();
        });

        it('given item will be updated & return the item', async () => {
            const item = await updateItem(filePath, '3', updatingItem);
            expect(fs.promises.writeFile).toHaveBeenCalledTimes(1);
            expect(item?.id).toBe(updatingItem.id);
        });
    });

    describe('delete Item from json file', () => {
        afterEach(() => {
            // @ts-ignore
            fs.promises.writeFile.mockClear();
            // @ts-ignore
            fs.mkdir.mockClear();
        });

        it('given item will be updated & return the item', async () => {
            const deleted = await deleteItem(filePath, '3');
            expect(fs.promises.writeFile).toHaveBeenCalledTimes(1);
            expect(deleted).toBeTruthy();
        });
    });
});
