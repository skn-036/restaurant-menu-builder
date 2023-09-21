import useValidation from '@/composables/validation/useValidation';
const { runYupValidation } = useValidation();
import * as yup from 'yup';

const schema = yup.object().shape({
    string: yup.string().nullable().required(),
    number: yup.number().nullable().required(),
    array: yup.array().min(1).required(),
});

describe('Composabe UseCommonUtils test', () => {
    it('should return are fields when data is validated', async () => {
        const validatingData = {
            string: 'foo',
            number: 10,
            array: [1, 2],
        };

        const { validated, data } = await runYupValidation(
            schema,
            validatingData
        );
        expect(validated).toBeTruthy();
        expect(data).toEqual(validatingData);
    });

    it('should return error field when data has been failded to validate', async () => {
        const validatingData = {
            string: {},
            number: 10,
            array: 'foo',
        };

        const { validated, errors } = await runYupValidation(
            schema,
            validatingData
        );
        expect(validated).toBeFalsy();
        // @ts-ignore
        expect('string' in errors).toBeTruthy();
        // @ts-ignore
        expect('array' in errors).toBeTruthy();
        // @ts-ignore
        expect('number' in errors).toBeFalsy();
    });
});
