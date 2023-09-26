import useCommonUtils from '@/composables/utils/useCommonUtils';
const {
    wordCapitalize,
    stringCapitalize,
    generateRandomNumber,
    isJsonParsable,
    kebabToCamelCase,
    camelToKebabCase,
    generateId,
    filterPropsFromObject,
    omitPropsFromObject,
    arrayFromNumber,
} = useCommonUtils();

describe('Composabe UseCommonUtils test', () => {
    it('function wordCapitalize() should capitalize first word of string', () => {
        expect(wordCapitalize('foo bar')).toBe('Foo bar');
    });

    it('function stringCapitalize() should capitalize each word of string', () => {
        expect(stringCapitalize('foo bar')).toBe('Foo Bar');
    });

    it('function generateRandomNumber() should generate a random number', () => {
        const number = generateRandomNumber(1000);
        expect(typeof number).toBe('number');
        expect(number).toBeGreaterThanOrEqual(0);
        expect(number).toBeLessThanOrEqual(1000);
    });

    it('function isJsonParsable() should parse valid json', () => {
        expect(isJsonParsable(JSON.stringify({ foo: 'bar' }))).toBeTruthy();
        expect(isJsonParsable({ foo: 'bar' })).toBeFalsy();
    });

    it('function kebabToCamelCase() should convert kebab to camel case', () => {
        expect(kebabToCamelCase('foo-bar-john-doe')).toBe('fooBarJohnDoe');
    });

    it('function camelToKebabCase() should convert camel to kebab case', () => {
        expect(camelToKebabCase('fooBarJohnDoe')).toBe('foo-bar-john-doe');
    });

    it('function generateId() should generate id', () => {
        const id = generateId('my-id-');
        expect(typeof id).toBe('string');
        expect(id.startsWith('my-id-')).toBeTruthy();
    });

    it('function filterPropsFromObject() should filter out given props from object', () => {
        const obj = {
            foo: 'bar',
            john: 'doe',
        };
        expect(filterPropsFromObject(obj, [])).toEqual({
            foo: 'bar',
            john: 'doe',
        });
        expect(filterPropsFromObject(obj, ['john'])).toEqual({ john: 'doe' });
    });

    it('function omitPropsFromObject() should omit given props from object', () => {
        const obj = {
            foo: 'bar',
            john: 'doe',
        };
        expect(omitPropsFromObject(obj, [])).toEqual({
            foo: 'bar',
            john: 'doe',
        });
        expect(omitPropsFromObject(obj, ['john'])).toEqual({ foo: 'bar' });
    });

    it('function arrayFromNumber() should generate array from given number using n + 1', () => {
        expect(arrayFromNumber(4, true)).toEqual([0, 1, 2, 3]);
        expect(arrayFromNumber(4, false)).toEqual([1, 2, 3, 4]);
    });
});
