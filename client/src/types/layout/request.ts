import { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

export type BaseRequestOptions = {
    queries?: Record<string, string>;
    axiosConfig?: AxiosRequestConfig;
    error?: (error: AxiosError) => void;
};

export type GetListRequestOptions<T> = BaseRequestOptions & {
    success?: (response: AxiosResponse, lastGetListRequestData: T[]) => void;
};

export type GetRequestOptions<T> = BaseRequestOptions & {
    success?: (response: AxiosResponse, lastGetRequestData: T) => void;
};

export type SaveRequestOptions = BaseRequestOptions & {
    success?: (response: AxiosResponse) => void;
};

export type UpdateRequestOptions = BaseRequestOptions & {
    success?: (response: AxiosResponse) => void;
};

export type DeleteRequestOptions = BaseRequestOptions & {
    success?: (response: AxiosResponse) => void;
};

// export type DeleteRequestOptions = BaseRequestOptions;
