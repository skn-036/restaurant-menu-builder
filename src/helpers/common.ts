export const removeLastChar = (
    str: string | undefined,
    lastChar: string,
    matchLastChar: boolean = true
) => {
    if (typeof str !== 'string') return str;
    if (!matchLastChar) return str.slice(0, -1);

    if (str.slice(-1) === lastChar) return str.slice(0, -1);
    return str;
};
