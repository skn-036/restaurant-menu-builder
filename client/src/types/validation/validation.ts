export type YupValidationData = Record<string, any>;

export type YupValidationError = Record<string, any> | undefined;

export type YupValidationResult = {
    validated: boolean;
    data?: YupValidationData;
    errors?: YupValidationError;
};
