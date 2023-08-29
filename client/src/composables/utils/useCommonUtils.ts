const useCommonUtils = () => {
    const wordCapitalize = (string: string): string =>
        string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

    const stringCapitalize = (string: string): string => {
        var capitalText = '';
        string
            .split(' ')
            .forEach(word => (capitalText += ' ' + stringCapitalize(word)));
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

    return {
        wordCapitalize,
        stringCapitalize,
        generateRandomNumber,
        isJsonParsable,
        kebabToCamelCase,
        camelToKebabCase,
    };
};

export default useCommonUtils;
