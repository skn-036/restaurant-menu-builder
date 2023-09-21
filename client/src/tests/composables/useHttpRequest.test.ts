import { vi } from 'vitest';
import axios from 'axios';

const baseUrl = 'https://foo.bar';
axios.defaults.baseURL = baseUrl;

const path = '/hello/world';

import useHttpRequest from '@/composables/request/useHttpRequest';
const { getList, get, save, update, destroy } = useHttpRequest(path);

describe('Composable UseHttpRequest test', () => {
    describe('getList() function', () => {
        afterEach(() => {
            vi.clearAllMocks();
        });

        it('should get item list', async () => {
            const mockResponse = { data: ['test', 'foo', 'bar'] };

            vi.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const response = await getList();

            expect(response).toEqual(mockResponse.data);
        });
    });

    describe('get() function', () => {
        afterEach(() => {
            vi.clearAllMocks();
        });
        it('should get item by id', async () => {
            const mockResponse = { data: { foo: 'bar' } };

            vi.spyOn(axios, 'get').mockResolvedValue(mockResponse);
            const response = await get('5');

            expect(response).toEqual(mockResponse.data);
        });
    });

    describe('save() function', () => {
        afterEach(() => {
            vi.clearAllMocks();
        });
        it('should save request payload', async () => {
            const mockResponse = { data: { foo: 'bar' } };

            vi.spyOn(axios, 'post').mockResolvedValue(mockResponse);
            const response = await save({ ...mockResponse.data });

            expect(response).toEqual(mockResponse.data);
        });
    });

    describe('update() function', () => {
        afterEach(() => {
            vi.clearAllMocks();
        });
        it('should save request payload', async () => {
            const mockResponse = { data: { foo: 'bar' } };

            vi.spyOn(axios, 'patch').mockResolvedValue(mockResponse);
            const response = await update(10, { ...mockResponse.data });

            expect(response).toEqual(mockResponse.data);
        });
    });

    describe('destroy() function', () => {
        afterEach(() => {
            vi.clearAllMocks();
        });
        it('should save request payload', async () => {
            const mockResponse = { data: true, status: 200 };

            vi.spyOn(axios, 'delete').mockResolvedValue(mockResponse);
            const response = await destroy(10);

            expect(response).toBe(mockResponse.data);
        });
    });
});
