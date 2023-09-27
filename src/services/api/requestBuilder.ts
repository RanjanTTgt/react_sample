import axios, { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import {store} from "../../store";
import {logout} from "../../slices";

export type HTTPMethod = 'get' | 'post' | 'delete' | 'put' | 'patch';

export interface JsonBody {
    // tslint:disable-next-line no-any
    [key: string]: any;
}

const apiUrl = process.env.API_URL;

export interface Request {
    method: HTTPMethod;
    url: string;
    body?: JsonBody;
    params?: any;
}


const buildRequest = (request: Request) => {
    const { body, method, url, params } = request;

    const contentType = body instanceof FormData ? 'multipart/form-data' : 'application/json; charset=utf-8';

    const headers: AxiosRequestHeaders = {
        'Content-Type': contentType
    };

    const requestConfig: AxiosRequestConfig = {
        baseURL: apiUrl,
        data: body,
        headers,
        withCredentials: true,
        method,
        url,
        params
    };
    return requestConfig;
};

const buildGoogleRequest = (request: Request) => {
    const { body, method, url } = request;

    const requestConfig: AxiosRequestConfig = {
        baseURL: apiUrl,
        data: body,
        method,
        url
    };
    return requestConfig;
};

export const defaultResponse: Partial<AxiosError['response']> = {
    status: 500,
    data: {
        message: 'Server error',
    },
};

export const formatError = (responseError: AxiosError) => {
    const response = responseError.response || defaultResponse;
    let errorMessage = response.data && response.data.message;
    let errors = (response.data && response.data.data);
    if(typeof(errorMessage) === "string" && errorMessage.toLowerCase().trim() === "unauthorised access"){
        store.dispatch(logout());
        errorMessage = "session.expired";
    }
    return {
        code: response.status,
        message: errorMessage,
        errors: errors ?? []
    };
};

export const makeRequest = async (request: Request) => {
    const requestConfig = buildRequest(request);
    return new Promise((resolve, reject) => {
        const axiosRequest: AxiosPromise = axios(requestConfig);
        axiosRequest
            .then(resolve)
            .catch((error: AxiosError) => {
                reject(formatError(error));
            });
    });
};

export const makeGoogleRequest = async (request: Request) => {
    const requestConfig = buildGoogleRequest(request);
    return new Promise((resolve, reject) => {
        const axiosRequest: AxiosPromise = axios(requestConfig);
        axiosRequest
            .then(resolve)
            .catch((error: AxiosError) => {
                reject(formatError(error));
            });
    });
};
