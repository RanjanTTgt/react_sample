import {API} from './api';
import {ChangePasswordParams} from "../slices";
import {authReturnErrorData, authSuccessData, ReturnError, ReturnSuccess} from "./index";

interface LoginParams {
    email: string;
    password: string;
}

interface ForgotPasswordParams {
    email: string;
}

interface VerifyOtpParams {
    email: string;
    otp: string;
}

interface ResetPasswordParams {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
}

export const login = (params: LoginParams) => {
    return API.post(`/auth/login`, params)
        .then((response) => response.data)
        .then((data) => data)
        .catch(authReturnErrorData);
}

export const forgotPassword = async (params: ForgotPasswordParams) => {
    return API.post(`/auth/forgot-password`, params)
        .then((response) => response.data)
        .then(authSuccessData)
        .catch(authReturnErrorData);
};

export const verifyOtp = async (params: VerifyOtpParams) => {
    return API.post(`/auth/verify-otp`, params)
        .then((response) => response.data)
        .then(authSuccessData)
        .catch(authReturnErrorData);
};


export const resetPassword = async (params: ResetPasswordParams) => {
    return API.post(`/auth/reset-password`, params)
        .then((response) => response.data)
        .then(authSuccessData)
        .catch(authReturnErrorData);
};

export const changePassword = async (params: ChangePasswordParams) => {
    return API.put(`/auth/change-password`, params)
        .then((response) => response.data)
        .then(ReturnSuccess)
        .catch(ReturnError);
};

export const updateDetail = async (params: FormData) => {
    return API.put(`/auth/update-profile`, params)
        .then((response) => response.data)
        .then((data) => data)
        .catch(ReturnError);
};
