import React, {useEffect, useState} from 'react';
import Alert from '@mui/material/Alert';
import { resetPassword, AUTH_STATUS, setDefaultState, pushAlertMessage } from '../../slices';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { validatePassword, convertError } from "../../utils";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import * as Images from "../../assets/images";
import {LoaderButtonIcon} from "../../helper";

interface IObjectKeys {
    [key: string]: any;
}

interface ResetPasswordStateType extends IObjectKeys {
    newPassword: string;
    newPasswordError: string;
    confirmPassword: string;
    confirmPasswordError: string;
    showPassword: boolean;
}

export const ResetPassword = () => {
    const authStatus = useAppSelector((state) => state.auth.status);
    const errorMsg = useAppSelector((state) => state.auth.errorMsg);
    const successMsg = useAppSelector((state) => state.auth.successMsg);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [ cookies, setCookies, clearCookies ] = useCookies(['email_address', 'email_otp']);

    useEffect(() => {
        // Update the document title using the browser API
        dispatch(setDefaultState());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const [state, setState] = useState<ResetPasswordStateType>({
        newPassword: "",
        newPasswordError: "",
        confirmPassword: "",
        confirmPasswordError: "",
        showPassword: false
    });

    const handleChange = (e :React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setState(prevState => ({...prevState, [name]: value}))
    }

    const { newPassword, newPasswordError, confirmPassword, confirmPasswordError, showPassword } = state;

    const toggleValue = (name :string) => {
        setState(prevState => ({...prevState, [name]: !state[name]}));
    }

    const checkValidation = (e: React.FocusEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if (value.length === 0) {
            setState(prevState => ({...prevState, [`${name}Error`]: convertError(`${name}.required`)}))
        } else if (name === "newPassword" && !validatePassword(value)) {
            setState(prevState => ({...prevState, [`${name}Error`]: convertError('newPassword.validation_failed')}))
        } else if (name === "confirmPassword" && confirmPassword !== newPassword) {
            setState(prevState => ({...prevState, [`${name}Error`]: convertError('confirmPassword.not_matched')}))
        } else if(confirmPassword === newPassword){
            setState(prevState => ({...prevState, [`confirmPasswordError`]: ""}))
        }
    }

    const resetErrorMessage = (e: React.FocusEvent<HTMLInputElement>) => {
        const {name} = e.target;
        setState(prevState => ({...prevState, [`${name}Error`]: ""}))
    }

    const validate = () => {
        let error = false;
        setState(prevState => ({...prevState, confirmPasswordError: "", newPasswordError: ""}));
        if (newPassword.length === 0) {
            setState(prevState => ({...prevState, newPasswordError: convertError('newPassword.required')}))
            error = true;
        } else if (!validatePassword(newPassword)){
            setState(prevState => ({...prevState, newPasswordError: convertError('newPassword.validation_failed')}))
            error = true;
        }
        if (confirmPassword.length === 0) {
            setState(prevState => ({...prevState, confirmPasswordError: convertError('confirmPassword.required')}))
            error = true;
        }
        if (newPassword.length && confirmPassword.length && newPassword !== confirmPassword) {
            setState(prevState => ({...prevState, confirmPasswordError: convertError('confirmPassword.not_matched')}))
            error = true;
        }
        return !error;
    }

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const email = cookies.email_address, otp = cookies.email_otp;
        if(!email || !otp){
            dispatch(pushAlertMessage({type: 'error', message: "otp.expired"}));
            navigate('/forgotPassword', {replace: true});
        } else if (validate()) {
            dispatch(resetPassword(email, otp, newPassword, confirmPassword, ()=>{
                clearCookies("email_address");
                clearCookies("email_otp");
                navigate('/login', {replace: true});
            }));
        }
    };

    const loading = authStatus === AUTH_STATUS.INPROGRESS;

    return (
        <>
            <div className="form-section">
                <h2>Reset Password</h2>
                {errorMsg !== '' && <Alert severity="error">{errorMsg}</Alert>}
                {successMsg !== '' && <Alert severity="success">{successMsg}</Alert>}

                <form>
                    <div className="form-outline mb-2 position-relative">
                        <label className="form-label" htmlFor="form2Example2">
                            New Password
                        </label>
                        <input type={showPassword ? "text" : "password"}
                               className={`form-control ${newPasswordError ? "error" : ""}`}
                               name="newPassword"
                               placeholder="Enter New Password"
                               value={newPassword}
                               onFocus={resetErrorMessage}
                               onBlur={checkValidation}
                               onChange={handleChange}
                               disabled={loading}/>
                        <img src={Images.EyeSvg} className="eye-icon" onClick={()=> toggleValue('showPassword')} alt=""/>
                        {newPasswordError && <p className="mt-1 ms-3 text-danger">{newPasswordError}</p>}
                    </div>

                    <div className="form-outline mb-2 position-relative">
                        <label className="form-label" htmlFor="form2Example2">
                            Confirm Password
                        </label>
                        <input type="password"
                               className={`form-control ${confirmPasswordError ? "error" : ""}`}
                               name="confirmPassword"
                               placeholder="Confirm Password"
                               value={confirmPassword}
                               onFocus={resetErrorMessage}
                               onBlur={checkValidation}
                               onChange={handleChange}
                               disabled={loading}/>
                        {confirmPasswordError && <p className="mt-1 ms-3 text-danger">{confirmPasswordError}</p>}
                    </div>

                  <button className="btn btn-primary btn-block mt-1 mb-2 show-top"
                          onClick={handleSubmit}
                          disabled={loading}>
                        Submit
                       <LoaderButtonIcon loading={loading}/>
                  </button>

                </form>
            </div>

        </>
    );
};
