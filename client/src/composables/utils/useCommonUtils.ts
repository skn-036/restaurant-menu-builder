import { v4 } from 'uuid';
const useCommonUtils = () => {
    const wordCapitalize = (string: string): string =>
        string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

    const stringCapitalize = (string: string): string => {
        var capitalText = '';
        string.split(' ').forEach(word => {
            capitalText = `${capitalText} ${wordCapitalize(word)}`;
        });
        return capitalText.slice(1);
    };

    const generateRandomNumber = (max: number = 100000): number => {
        return Math.floor(Math.random() * max + 1);
    };

    const isJsonParsable = (string: string): boolean => {
        try {
            const parsed = JSON.parse(string);
            return Boolean(parsed);
        } catch (err) {
            return false;
        }
    };

    const kebabToCamelCase = (string: string): string => {
        return string.replace(/-([a-z])/g, function (g) {
            return g[1].toUpperCase();
        });
    };

    const camelToKebabCase = (string: string): string => {
        return string
            .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
            .toLowerCase();
    };

    const generateId = (prefix: string = '') => {
        return `${prefix}${v4()}`;
    };

    const filterPropsFromObject = (
        object: Record<string, any>,
        filteringProps: string[] = []
    ) => {
        if (!filteringProps || !filteringProps.length) return object;
        return Object.entries(object).reduce((fields, field) => {
            if (filteringProps.includes(field[0]))
                fields = { ...fields, [field[0]]: field[1] };
            return fields;
        }, {});
    };

    const omitPropsFromObject = (
        object: Record<string, any>,
        omittingProps: string[] = []
    ) => {
        if (!omittingProps || !omittingProps.length) return object;
        return Object.entries(object).reduce((fields, field) => {
            if (!omittingProps.includes(field[0]))
                fields = { ...fields, [field[0]]: field[1] };
            return fields;
        }, {});
    };

    return {
        wordCapitalize,
        stringCapitalize,
        generateRandomNumber,
        isJsonParsable,
        kebabToCamelCase,
        camelToKebabCase,
        generateId,
        filterPropsFromObject,
        omitPropsFromObject,
    };
};

export default useCommonUtils;
