/* c8 ignore next 373 */
import { ref } from 'vue';
import axios from 'axios';
import { CancelTokenSource, AxiosError, AxiosRequestConfig } from 'axios';
import {
    GetListRequestOptions,
    GetRequestOptions,
    SaveRequestOptions,
    UpdateRequestOptions,
    DeleteRequestOptions,
} from '@/types/layout/request';

const useHttpRequest = (path: string = '') => {
    const loading = ref(false);
    const loadingForFirstTime = ref(true);
    const getting = ref(false);
    const gettingForFirstTime = ref(true);
    const saving = ref(false);
    const updating = ref(false);
    const deleting = ref(false);
    const cancelTokenList = ref<CancelTokenSource | null>(null);
    const cancelTokenGet = ref<CancelTokenSource | null>(null);
    const cancelTokenSave = ref<CancelTokenSource | null>(null);
    const cancelTokenUpdate = ref<CancelTokenSource | null>(null);
    const lastGetListRequestData = ref<any>([]);
    const lastGetRequestData = ref<any | null>(null);
    const lastSaveRequestData = ref<any | null>(null);
    const lastUpdateRequestData = ref<any | null>(null);

    const getList = async <T = any>(options: GetListRequestOptions<T> = {}) => {
        try {
            loading.value = true;

            const routeQuery = options?.queries
                ? `?${new URLSearchParams(options.queries).toString()}`
                : '';

            if (cancelTokenList.value) {
                cancelTokenList.value.cancel('New request triggered');
            }
            cancelTokenList.value = axios.CancelToken.source();

            const defaultAxiosConfig: AxiosRequestConfig = {
                cancelToken: cancelTokenList.value
                    ? cancelTokenList.value.token
                    : undefined,
            };
            const axiosConfig: AxiosRequestConfig = {
                ...defaultAxiosConfig,
                ...(options.axiosConfig || {}),
            };

            const response = await axios.get<T>(
                `${path}${routeQuery}`,
                axiosConfig
            );

            if (response?.data) {
                lastGetListRequestData.value = response.data as T;
                loading.value = false;
                loadingForFirstTime.value = false;

                if (typeof options.success === 'function') {
                    options.success(response, lastGetListRequestData.value);
                }

                return response.data;
            }

            loading.value = false;
            loadingForFirstTime.value = false;
            return [];
        } catch (error) {
            if (error instanceof AxiosError) {
                if (typeof options.error === 'function') options.error(error);

                if (error && error.message === 'New request triggered')
                    return lastGetListRequestData.value as T;
            }

            loading.value = false;
            loadingForFirstTime.value = false;
            return [];
        }
    };

    const get = async <T = any>(
        id: string | number | null,
        options: GetRequestOptions<T> = {}
    ) => {
        try {
            getting.value = true;

            const routeQuery = options?.queries
                ? `?${new URLSearchParams(options.queries).toString()}`
                : '';

            if (cancelTokenGet.value) {
                cancelTokenGet.value.cancel('New request triggered');
            }
            cancelTokenGet.value = axios.CancelToken.source();

            const defaultAxiosConfig: AxiosRequestConfig = {
                cancelToken: cancelTokenGet.value
                    ? cancelTokenGet.value.token
                    : undefined,
            };
            const axiosConfig: AxiosRequestConfig = {
                ...defaultAxiosConfig,
                ...(options.axiosConfig || {}),
            };

            const response = await axios.get<T>(
                `${path}${routeQuery}${id ? id : ''}`,
                axiosConfig
            );

            if (response?.data) {
                lastGetRequestData.value = response.data as T;
                getting.value = false;
                gettingForFirstTime.value = false;

                if (typeof options.success === 'function') {
                    options.success(response, lastGetRequestData.value);
                }

                return response.data;
            }

            getting.value = false;
            gettingForFirstTime.value = false;
            return null;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (typeof options.error === 'function') options.error(error);

                if (error && error.message === 'New request triggered')
                    return lastGetRequestData.value as T;
            }
            getting.value = false;
            gettingForFirstTime.value = false;
            return null;
        }
    };

    const save = async <T = any>(
        params: Record<string, any>,
        options: SaveRequestOptions = {}
    ) => {
        try {
            saving.value = true;

            const routeQuery = options?.queries
                ? `?${new URLSearchParams(options.queries).toString()}`
                : '';

            if (cancelTokenSave.value) {
                cancelTokenSave.value.cancel('New request triggered');
            }
            cancelTokenSave.value = axios.CancelToken.source();

            const defaultAxiosConfig: AxiosRequestConfig = {
                cancelToken: cancelTokenSave.value
                    ? cancelTokenSave.value.token
                    : undefined,
            };
            const axiosConfig: AxiosRequestConfig = {
                ...defaultAxiosConfig,
                ...(options.axiosConfig || {}),
            };

            const response = await axios.post<T | null>(
                `${path}${routeQuery}`,
                params,
                axiosConfig
            );

            if (response?.data) {
                saving.value = false;
                lastSaveRequestData.value = response.data;

                if (typeof options.success === 'function') {
                    options.success(response);
                }

                return response.data;
            }

            saving.value = false;
            return null;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (typeof options.error === 'function') options.error(error);

                if (error && error.message === 'New request triggered')
                    return lastSaveRequestData.value as T;
            }
            saving.value = false;
            return null;
        }
    };

    const update = async <T = any>(
        id: string | number | null,
        params: Record<string, any>,
        options: UpdateRequestOptions = {}
    ) => {
        try {
            updating.value = true;

            const routeQuery = options?.queries
                ? `?${new URLSearchParams(options.queries).toString()}`
                : '';

            if (cancelTokenUpdate.value) {
                cancelTokenUpdate.value.cancel('New request triggered');
            }
            cancelTokenUpdate.value = axios.CancelToken.source();

            const defaultAxiosConfig: AxiosRequestConfig = {
                cancelToken: cancelTokenUpdate.value
                    ? cancelTokenUpdate.value.token
                    : undefined,
            };
            const axiosConfig: AxiosRequestConfig = {
                ...defaultAxiosConfig,
                ...(options.axiosConfig || {}),
            };

            const response = await axios.patch<T | null>(
                `${path}${routeQuery}${id ? id : ''}`,
                params,
                axiosConfig
            );

            if (response?.data) {
                updating.value = false;
                lastUpdateRequestData.value = response.data;

                if (typeof options.success === 'function') {
                    options.success(response);
                }

                return response.data;
            }

            updating.value = false;
            return null;
        } catch (error) {
            if (error instanceof AxiosError) {
                if (typeof options.error === 'function') options.error(error);

                if (error && error.message === 'New request triggered')
                    return lastUpdateRequestData.value as T;
            }
            updating.value = false;
            return null;
        }
    };

    const destroy = async (
        id: string | number | null,
        options: DeleteRequestOptions = {}
    ) => {
        try {
            deleting.value = true;

            const routeQuery = options?.queries
                ? `?${new URLSearchParams(options.queries).toString()}`
                : '';

            const axiosConfig = options?.axiosConfig ? options.axiosConfig : {};

            const response = await axios.delete(
                `${path}${routeQuery}${id ? id : ''}`,
                axiosConfig
            );

            if (response?.data) {
                deleting.value = false;

                if (typeof options.success === 'function') {
                    options.success(response);
                }

                return Boolean(response.status.toString().startsWith('20'));
            }

            deleting.value = false;
            return false;
        } catch (error) {
            deleting.value = false;

            if (error instanceof AxiosError) {
                if (typeof options.error === 'function') options.error(error);
            }
            return false;
        }
    };

    return {
        loading,
        loadingForFirstTime,
        getting,
        gettingForFirstTime,
        saving,
        updating,
        deleting,

        getList,
        get,
        save,
        update,
        destroy,
    };
};

export default useHttpRequest;
