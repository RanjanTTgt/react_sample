import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { login, setDefaultState, AUTH_STATUS } from '../../slices';
import Alert from '@mui/material/Alert';
import { validateEmail, convertError } from "../../utils";
import * as Images from "../../assets/images";
import {LoaderButtonIcon} from "../../helper";

interface LocationState {
    from: {
        pathname: string;
    };
}

export interface IObjectKeys {
    [key: string]: any;
}

interface LoginStateType extends IObjectKeys {
    email: string;
    emailError: string;
    password: string;
    passwordError: string;
    showPassword: boolean;
    rememberMe: boolean;
}

export const LogIn = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as LocationState)?.from?.pathname || '/';

    useEffect(() => {
        // Update the document title using the browser API
        dispatch(setDefaultState());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [state, setState] = useState<LoginStateType>({
        email: "",
        emailError: "",
        password: "",
        passwordError: "",
        showPassword: false,
        rememberMe: false
    });

    const { email, password, emailError, passwordError, showPassword, rememberMe } = state;

    const validate = () => {
        let error = false;
        if (email.length === 0) {
            setState(prevState => ({...prevState, emailError: "Email is required"}));
            setState(prevState => ({...prevState, emailError: convertError('email.required')}));
            error = true;
        } else if (!validateEmail(email)) {
            setState(prevState => ({...prevState, emailError: convertError('email.invalid')}));
            error = true;
        }
        if (password.length === 0) {
            setState(prevState => ({...prevState, passwordError: convertError('password.required')}));
            error = true;
        }
        return !error;
    }

    const handleChange = (e :React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setState(prevState => ({...prevState, [name]: value}))
    }

    const checkValidation = (e: React.FocusEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        if (value.length === 0) {
            setState(prevState => ({...prevState, [`${name}Error`]: convertError(`${name}.required`)}));
        } else if (name === "email" && !validateEmail(value)) {
            setState(prevState => ({...prevState, [`${name}Error`]: convertError(`${name}.invalid`)}))
        }
    }

    const resetErrorMessage = (e: React.FocusEvent<HTMLInputElement>) => {
        const {name} = e.target;
        setState(prevState => ({...prevState, [`${name}Error`]: ""}))
    }

    const toggleValue = (name :string) => {
        setState(prevState => ({...prevState, [name]: !state[name]}));
    }

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (validate()) {
            dispatch(login(email, password, () => navigate(from, {replace: true})));
        }
    }

    const authStatus = useAppSelector((state) => state.auth.status);
    const errorMsg = useAppSelector((state) => state.auth.errorMsg);
    const loading = authStatus === AUTH_STATUS.INPROGRESS;

    return (
        <>
            <div className="form-section">
                <h2>Sign In</h2>

                {errorMsg && authStatus === AUTH_STATUS.FAILED && (
                    <Alert severity="error">{errorMsg}!</Alert>
                )}

                <form id={"login-form"} role="form">
                    <div className="form-outline mb-4 position-relative">
                        <label className="form-label" htmlFor="form2Example1">
                            Email address
                        </label>
                        <input type="email"
                               className={`form-control ${emailError ? "error" : ""}`}
                               name="email"
                               placeholder="Enter Email Address"
                               value={email}
                               onFocus={resetErrorMessage}
                               onBlur={checkValidation}
                               onChange={handleChange}
                               disabled={loading}/>
                        {emailError && <p className="mt-1 ms-3 text-danger">{emailError}</p>}
                    </div>

                    <div className="form-outline mb-4 position-relative">
                        <label className="form-label" htmlFor="form2Example2">Password</label>
                        <input type={showPassword ? "text" : "password"}
                               className={`form-control ${passwordError ? "error" : ""}`}
                               name="password"
                               placeholder="Enter Password"
                               value={password}
                               onFocus={resetErrorMessage}
                               onBlur={checkValidation}
                               onChange={handleChange}
                               disabled={loading}/>
                        <img src={!showPassword ? Images.EyeOverlaySvg : Images.EyeSvg} className="eye-icon" onClick={() => toggleValue('showPassword')} alt="" />
                        {passwordError && <p className="mt-1 ms-3 text-danger">{passwordError}</p>}
                    </div>


                    <div className="row mb-4">
                        {/* <div className="col d-flex justify-content-center">
                        <div className="form-check">
                                <input className="form-check-input"
                                       name={'rememberMe'}
                                       type="checkbox"
                                       onChange={() => toggleValue('rememberMe')}
                                       checked={rememberMe}
                                       disabled={loading}/>
                                <label className="form-check-label" htmlFor="form2Example31"> Remember me </label>
                            </div>
                        </div> */}

                        <div className="col d-flex">
                            <Link to={'/forgotPassword'}
                                  className={`right ms-auto forgot-btn ${loading ? "disabled" : ""}`}>
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    <button className="btn btn-primary btn-block mt-1 mb-2 show-top"
                            onClick={handleSubmit}
                            disabled={loading}>
                        Sign In
                        <LoaderButtonIcon loading={loading}/>
                    </button>
                </form>
            </div>
        </>
    );
};
