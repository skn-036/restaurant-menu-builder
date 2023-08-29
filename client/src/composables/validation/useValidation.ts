import * as yup from 'yup';
import {
    YupValidationData,
    YupValidationResult,
} from '@/types/validation/validation';

const useValidation = () => {
    const getData = (
        schema: yup.Schema,
        value: YupValidationData
    ): Record<string, number | boolean | string | object> => {
        // @ts-ignore
        return Object.entries(schema?.fields || {}).reduce(
            (r, field: [string, any]) => {
                const [key, val] = field;
                if ('fields' in val) {
                    if (value && typeof value === 'object' && key in value) {
                        // @ts-ignore
                        return { ...r, [key]: getData(val, value[key]) };
                    }
                    return r;
                } else {
                    if (value && typeof value === 'object' && key in value) {
                        return { ...r, [key]: (value as any)[key] };
                    }
                    return r;
                }
            },
            {}
        );
    };

    const runYupValidation = async (
        schema: yup.Schema,
        value: YupValidationData
    ): Promise<YupValidationResult> => {
        try {
            await schema.validate(value, {
                abortEarly: false,
            });

            return {
                validated: true,
                data: getData(schema, value),
                errors: {},
            };
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                return {
                    validated: false,
                    data: {},
                    errors: error.inner.reduce((prev, err, index) => {
                        const { path, message } = err;
                        if (!message) return prev;
                        return { ...prev, [path ? path : index]: message };
                    }, {}),
                };
            }
            return {
                validated: false,
                data: {},
                errors: {},
            };
        }
    };

    return {
        runYupValidation,
    };
};

export default useValidation;
