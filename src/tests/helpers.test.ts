import { removeLastChar } from '@/helpers/common';
import { createDirectory } from '@/helpers/file';
import path from 'path';
import fs from 'fs';

jest.mock('fs', () => {
    return {
        ...jest.requireActual('fs'),
        mkdir: jest.fn(
            (
                path: string,
                opts: fs.MakeDirectoryOptions & {
                    recursive: true;
                },
                cb
            ) => cb(null)
        ),
    };
});

describe('Test helper functions', () => {
    // testing removing last character functionality
    describe('Removing last character of a string', () => {
        it('given a matched last character and matching last character is truthy, should remove last character', () => {
            expect(removeLastChar('Hello Nusaib!', '!')).toBe('Hello Nusaib');
        });

        it('given a not matched last character and matching last character is falsy, should remove last character', () => {
            expect(removeLastChar('Hello Nusaib!', 'a', false)).toBe(
                'Hello Nusaib'
            );
        });

        it('given a not matched last character and matching last character is truthy, should not remove last character', () => {
            expect(removeLastChar('Hello Nusaib!', 'a', true)).toBe(
                'Hello Nusaib!'
            );
        });

        it('given undefined it should return undefined', () => {
            expect(removeLastChar(undefined, 'any')).toBeUndefined();
        });
    });

    describe('Check if directory is created if directory path given', () => {
        const filePath: string = path
            .join(__dirname, '../../public/test')
            .split('\\')
            .join('/');

        const omittingLastPathArr = filePath.split('/');
        omittingLastPathArr.pop();
        const omittingLastPath = omittingLastPathArr.join('/');

        afterEach(() => {
            // @ts-ignore
            fs.mkdir.mockClear();
        });

        it('given directory path & path to file falsy, should create directory', async () => {
            createDirectory(filePath, false);

            expect(fs.mkdir).toHaveBeenCalled();
            expect(fs.mkdir).toHaveBeenCalledWith(
                filePath,
                { recursive: true },
                expect.any(Function)
            );
        });

        it('given directory path & path to file truthy, should create directory omitting file path', async () => {
            createDirectory(filePath, true);

            expect(fs.mkdir).toHaveBeenCalled();
            expect(fs.mkdir).toHaveBeenCalledWith(
                omittingLastPath,
                { recursive: true },
                expect.any(Function)
            );
        });
    });
});
