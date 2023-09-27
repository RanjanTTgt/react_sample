import { AxiosResponse } from 'axios';
import {JsonBody, makeGoogleRequest, makeRequest} from './requestBuilder';

export type RequestBody = JsonBody | FormData;

export type RequestMethod = (url: string, body?: RequestBody) => Promise<AxiosResponse['data']>;

export interface ApiWrapper {
    get: RequestMethod;
    post: RequestMethod;
    patch: RequestMethod;
    put: RequestMethod;
    delete: RequestMethod;
    googleVision: RequestMethod;
}

export const API: ApiWrapper = {
    get: async (url: string, params?: JsonBody) =>
        makeRequest({
            method: 'get',
            url,
            params
        }),

    post: async (url: string, body?: JsonBody) =>
        makeRequest({
            method: 'post',
            body,
            url,
        }),

    patch: async (url: string, body?: JsonBody) =>
        makeRequest({
            method: 'patch',
            body,
            url,
        }),

    put: async (url: string, body?: JsonBody) =>
        makeRequest({
            method: 'put',
            body,
            url,
        }),

    delete: async (url: string, body?: JsonBody) =>
        makeRequest({
            method: 'delete',
            body,
            url,
        }),

    googleVision: async (url: string, body?: JsonBody) =>
        makeGoogleRequest({
            method: 'post',
            body,
            url,
        }),
};