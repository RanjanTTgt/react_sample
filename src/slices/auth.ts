import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { RootState, AppDispatch } from '../store';
import * as AuthService from '../services/auth';
import { pushAlertMessage } from "./alerts";

export enum AUTH_STATUS {
  SUCCESS,
  FAILED,
  INPROGRESS,
}

export interface UserDetailsInterface {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  created_by: number;
  status: number;
  updated_at: string;
  updated_by: string | number;
}

export interface UserDetailInterface {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  address: string;
  countryCode: string;
  profileImage: string;
  phone: string;
}

// Define a type for the slice state
interface AuthState {
  status: AUTH_STATUS;
  userDetails: UserDetailInterface | null;
  errorMsg: string;
  successMsg: string;
}

interface UserDetailPayload extends UserDetailInterface {
  address: string;
  profileImage: string;
  phone: string;
}

// Define the initial state using that type
const initialState: AuthState = {
  status: AUTH_STATUS.FAILED,
  userDetails: null,
  errorMsg: '',
  successMsg: '',
};

export interface ChangePasswordParams {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const authSlice = createSlice({
  name: 'auth',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    clearError: (state) => {
      state.errorMsg = '';
    },
    setDefaultState: (state) => {
      state.errorMsg = '';
      state.successMsg = '';
      state.userDetails = null;
      state.status = AUTH_STATUS.FAILED;
    },
    logout: () => {
      // We do not need to make any changes in state as we remove session storage completely in store.ts
      return initialState;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    authError: (state, action: PayloadAction<string>) => {
      state.successMsg = '';
      state.errorMsg = action.payload;
      state.status = AUTH_STATUS.FAILED;
    },
    loginFailed: (state, action: PayloadAction<string>) => {
      state.errorMsg = action.payload;
      state.userDetails = null;
      state.status = AUTH_STATUS.FAILED;
    },
    loginSucceeded: (state, action: PayloadAction<UserDetailInterface | null>) => {
      state.userDetails = action.payload;
      state.status = AUTH_STATUS.SUCCESS;
    },
    serviceInProgress: (state) => {
      state.errorMsg = '';
      state.successMsg = '';
      state.userDetails = null;
      state.status = AUTH_STATUS.INPROGRESS;
    },
    forgotPasswordResult: (state, action: PayloadAction<Partial<AuthState>>) => {
      state.successMsg = action.payload.successMsg || '';
      state.errorMsg = action.payload.errorMsg || '';
      state.status = AUTH_STATUS.FAILED;
    },
    verifyOtpResult: (state, action: PayloadAction<Partial<AuthState>>) => {
      state.successMsg = action.payload.successMsg || '';
      state.errorMsg = action.payload.errorMsg || '';
      state.status = AUTH_STATUS.FAILED;
    },
    resetPasswordResult: (state, action: PayloadAction<Partial<AuthState>>) => {
      state.successMsg = action.payload.successMsg || '';
      state.errorMsg = action.payload.errorMsg || '';
      state.status = AUTH_STATUS.FAILED;
    },
    updateUserDetail: (state, action: PayloadAction<Partial<UserDetailPayload>>) => {
      if(state.userDetails){
        state.userDetails = {...state.userDetails, ...action.payload};
      }
    },
  },
});

export const {
  clearError,
  logout,
  setDefaultState,
  loginFailed,
  authError,
  loginSucceeded,
  serviceInProgress,
  forgotPasswordResult,
  verifyOtpResult,
  resetPasswordResult,
  updateUserDetail
} = authSlice.actions;


export const login = (email: string, password: string, callback: VoidFunction) => async (dispatch: AppDispatch) => {
    dispatch(serviceInProgress());
    const response = await AuthService.login({email, password});
    if (!response.status) {
      // dispatch(pushAlertMessage({type: 'error', message: response.errorMsg}));
      dispatch(loginFailed(response.errorMsg));
    } else {
      dispatch(loginSucceeded(response.data));
      callback();
    }
}

export const forgotPassword = (email: string, callback: VoidFunction) => async (dispatch: AppDispatch) => {
  dispatch(serviceInProgress());
  const { status, ...response } = await AuthService.forgotPassword({email});
  if (!status) {
    // dispatch(pushAlertMessage({type: 'error', message: response.errorMsg}));
    dispatch(forgotPasswordResult(response));
  } else {
    dispatch(pushAlertMessage({type: 'success', message: response.successMsg}));
    dispatch(forgotPasswordResult(response));
    callback();
  }
}

export const verifyOtp = (email: string, otp: string, callback: VoidFunction) => async (dispatch: AppDispatch) => {
  dispatch(serviceInProgress());
  const { status, ...response} = await AuthService.verifyOtp({email, otp});
  if (!status) {
    // dispatch(pushAlertMessage({type: 'error', message: response.errorMsg}));
    dispatch(verifyOtpResult(response));
  } else {
    dispatch(pushAlertMessage({type: 'success', message: response.successMsg}));
    callback();
  }
}

export const resetPassword = (email: string, otp: string, newPassword: string, confirmPassword: string, callback: VoidFunction) => async (dispatch: AppDispatch) => {
  dispatch(serviceInProgress());
  const { status, ...response } = await AuthService.resetPassword({email, otp, newPassword, confirmPassword});
  if (!status) {
    // dispatch(pushAlertMessage({type: 'error', message: response.errorMsg}));
    dispatch(resetPasswordResult(response));
  } else {
    dispatch(pushAlertMessage({type: 'success', message: response.successMsg}));
    callback();
  }
};

export const changePassword = (params: ChangePasswordParams, callback: (status: boolean, response: any) => void) => async (dispatch: AppDispatch) => {
  const { status, ...response } = await AuthService.changePassword(params);
  if(!status) {
    dispatch(pushAlertMessage({type: 'error', message: response.message, skip: response.errors?.length > 0}));
  } else {
    dispatch(pushAlertMessage({type: 'success', message: response.message}));
  }
  callback(status, response);
}

export const updateDetail = (params: FormData, callback: (status: boolean, response: any) => void) => async (dispatch: AppDispatch) => {
  const { status, ...response } = await AuthService.updateDetail(params);
  if(!status) {
    dispatch(pushAlertMessage({type: 'error', message: response.message, skip: response.errors?.length > 0}));
  } else {
    dispatch(pushAlertMessage({type: 'success', message: response.message}));
    dispatch(updateUserDetail(response.data));
  }
  callback(status, response);
};

// Other code such as selectors can use the imported `RootState` type
export const selectAuthStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;
