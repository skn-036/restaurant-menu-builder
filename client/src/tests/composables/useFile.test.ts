import { vi } from 'vitest';
import useFile from '@/composables/files/useFile';

describe('Composabe UseFile test', () => {
    const { resolvePathUrl, toBase64, getImageDimensions, openFileStream } =
        useFile();

    const byteData = new Uint8Array([
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0,
        1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137, 0, 0, 0, 11, 73, 68, 65,
        84, 8, 215, 99, 248, 207, 0, 0, 2, 255, 1, 254, 236, 100, 150, 0, 0, 0,
        0, 73, 69, 78, 68, 174, 66, 96, 130,
    ]);

    const blob = new Blob([byteData.buffer], { type: 'image/png' });
    const file = new File([blob], 'test.png', {
        type: 'image/png',
        lastModified: Date.now(),
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('should resolve path url properly on resolvePathUrl()', () => {
        const path = resolvePathUrl('foo/bar');
        expect(path).toContain('/assets/foo/bar');
    });

    it('should return base64 string of the file on toBase64()', async () => {
        const base64 = await toBase64(file);

        expect(typeof base64).toBe('string');
        expect(base64).toContain('data:image/png;base64,');
    });

    it('should return image dimension on getImageDimensions()', async () => {
        // @ts-ignore
        global.Image = class {
            constructor() {
                // @ts-ignore
                this.width = 40;
                // @ts-ignore
                this.height = 20;
                // @ts-ignore
                this.ratio = this.width / this.height;
                // @ts-ignore
                this.onload = () => {
                    return { a: 'a' };
                };
                setTimeout(() => {
                    // @ts-ignore
                    this.onload();
                }, 100);
            }
        };

        const base64 = await toBase64(file);
        const dimension = await getImageDimensions(base64);

        expect(dimension.width).toBe(40);
        expect(dimension.height).toBe(20);
        expect(dimension.ratio).toBe(2);
    });

    it('should create URL.createObjectUrl openFileStream()', async () => {
        window.URL.createObjectURL = vi.fn(() => 'created object url');
        openFileStream(byteData);
        expect(window.URL.createObjectURL).toBeCalledTimes(1);
    });
});
