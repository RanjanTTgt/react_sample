import React, { useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { LoaderButtonIcon, MessageAlertDiv} from "../../helper";
import { changePassword } from "../../slices";
import { validatePassword } from "../../utils";
import _ from 'lodash';

interface ChangePasswordStateInterface {
    currentPassword: string;
    currentPasswordError: string;
    newPassword: string;
    newPasswordError: string;
    confirmPassword: string;
    confirmPasswordError: string;
    loading: boolean;
}

const DefaultState: ChangePasswordStateInterface = {
    currentPassword: "",
    currentPasswordError: "",
    newPassword: "",
    newPasswordError: "",
    confirmPassword: "",
    confirmPasswordError: "",
    loading: false
};

export const ChangePassword = () => {
    const dispatch = useAppDispatch();

    const [state, setState] = useState<ChangePasswordStateInterface>(DefaultState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setState(prevState => ({...prevState, [name]: value}))
    }

    const checkValidation = (e: React.FocusEvent<HTMLInputElement>) => {
        const { currentPassword, newPassword, confirmPassword } = state;
        const {name, value} = e.target;
        if (value.length === 0) {
            setState(prevState => ({...prevState, [`${name}Error`]: `${name}.required`}))
        } else if (name === "newPassword" && !validatePassword(value)) {
            setState(prevState => ({...prevState, [`${name}Error`]: 'newPassword.validation_failed'}))
        } else if (name === "newPassword" && value === currentPassword) {
            setState(prevState => ({...prevState, [`${name}Error`]: 'newPassword.not_same'}))
        } else if (name === "confirmPassword" && confirmPassword !== newPassword) {
            setState(prevState => ({...prevState, [`${name}Error`]: 'confirmPassword.not_matched'}))
        } else if (confirmPassword === newPassword) {
            setState(prevState => ({...prevState, [`confirmPasswordError`]: ""}))
        }
    }

    const resetErrorMessage = (e: React.FocusEvent<HTMLInputElement>) => {
        const {name} = e.target;
        setState(prevState => ({...prevState, [`${name}Error`]: ""}))
    }

    const validate = () => {
        let error = false;
        const {newPassword, confirmPassword, currentPassword } = state;
        setState(prevState => ({...prevState, currentPasswordError: "", confirmPasswordError: "", newPasswordError: ""}));
        if (currentPassword.length === 0) {
            setState(prevState => ({...prevState, currentPasswordError: 'currentPassword.required'}))
            error = true;
        }
        if (newPassword.length === 0) {
            setState(prevState => ({...prevState, newPasswordError: 'newPassword.required'}))
            error = true;
        } else if (!validatePassword(newPassword)) {
            setState(prevState => ({...prevState, newPasswordError: 'newPassword.validation_failed'}))
            error = true;
        }
        if (newPassword.length && currentPassword.length && currentPassword === newPassword) {
            setState(prevState => ({...prevState, newPasswordError: 'newPassword.not_same'}))
            error = true;
        }
        if (confirmPassword.length === 0) {
            setState(prevState => ({...prevState, confirmPasswordError: 'confirmPassword.required'}))
            error = true;
        }
        if (newPassword.length && confirmPassword.length && newPassword !== confirmPassword) {
            setState(prevState => ({...prevState, confirmPasswordError: 'confirmPassword.not_matched'}))
            error = true;
        }
        return !error;
    }

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (validate()) {
            const {newPassword, confirmPassword, currentPassword } = state;
            let params = {newPassword, confirmPassword, currentPassword};
            await setState(prevState=> ({...prevState, loading: true}));
            await dispatch(changePassword(params, (status, response)=>{
                if(!status){
                    response.errors && _.map(response.errors, (error)=>{
                        setState(prevState=> ({...prevState, [`${error.param}Error`]: error.msg}));
                    });
                } else {
                    setState(prevState=> ({...prevState, ...DefaultState}));
                }
            }));
            await setState(prevState=> ({...prevState, loading: false}));
        }
    }

    return (
        <>
            <section className="main-section profilePage">
                <div className="container">
                    <div className="inner-section">
                        <div className="pe-lg-5 ps-lg-5">

                            <div className="d-flex w-100 product-search-header flex-wrap heading">
                                <h2>Change Password</h2>
                            </div>

                            <form className="row">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-outline mb-4 formInput">
                                            <label className="form-label">
                                                Current Password
                                            </label>
                                            <input type="password"
                                                   className={`form-control ${state.currentPasswordError ? "error" : ""}`}
                                                   name="currentPassword"
                                                   placeholder="Enter Current Password"
                                                   value={state.currentPassword}
                                                   onFocus={resetErrorMessage}
                                                   onBlur={checkValidation}
                                                   onChange={handleChange}
                                                   disabled={state.loading}/>
                                            <MessageAlertDiv message={state.currentPasswordError} type={"error"}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-outline mb-4 formInput">
                                            <label className="form-label">
                                                New Password
                                            </label>
                                            <input type="password"
                                                   className={`form-control ${state.newPasswordError ? "error" : ""}`}
                                                   name="newPassword"
                                                   placeholder="Enter New Password"
                                                   value={state.newPassword}
                                                   onFocus={resetErrorMessage}
                                                   onBlur={checkValidation}
                                                   onChange={handleChange}
                                                   disabled={state.loading}/>
                                            <MessageAlertDiv message={state.newPasswordError} type={"error"}/>
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-outline mb-4 formInput">
                                            <label className="form-label">
                                                Confirm Password
                                            </label>
                                            <input type="password"
                                                   className={`form-control ${state.confirmPasswordError ? "error" : ""}`}
                                                   name="confirmPassword"
                                                   placeholder="Enter Confirm Password"
                                                   value={state.confirmPassword}
                                                   onFocus={resetErrorMessage}
                                                   onBlur={checkValidation}
                                                   onChange={handleChange}
                                                   disabled={state.loading}/>
                                            <MessageAlertDiv message={state.confirmPasswordError} type={"error"}/>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="col-sm-12 mt-5 d-flex justify-content-end w-100 align-items-center flex-wrap">
                                    <button className="btn-primary "
                                            onClick={handleSubmit}
                                            disabled={state.loading}>
                                        Change Password
                                        <LoaderButtonIcon loading={state.loading}/>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

