import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Alert from '@mui/material/Alert';
import { forgotPassword, AUTH_STATUS, setDefaultState } from '../../slices';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { validateEmail, convertError } from "../../utils";
import * as Images from "../../assets/images";
import {LoaderButtonIcon} from "../../helper";

interface ForgotPasswordInterface {
  email: string;
  emailError: string;
}

export const ForgotPassword = () => {
  const authStatus = useAppSelector((state) => state.auth.status);
  const errorMsg = useAppSelector((state) => state.auth.errorMsg);
  const successMsg = useAppSelector((state) => state.auth.successMsg);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [cookies, setCookie] = useCookies(['email_address']);

  useEffect(() => {
    // Update the document title using the browser API
    dispatch(setDefaultState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [state, setState] = useState<ForgotPasswordInterface>({email: "", emailError: ""})

  const handleChange = (e :React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setState(prevState => ({...prevState, [name]: value}))
  }

  const {email, emailError} = state;

  const checkValidation = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(value.length === 0) {
      setState(prevState => ({...prevState, [`${name}Error`]: convertError(`${name}.required`)}));
    } else if(name === "email" && !validateEmail(value)){
      setState(prevState => ({...prevState, [`${name}Error`]: convertError(`${name}.invalid`)}));
    }
  }

  const resetErrorMessage = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setState(prevState => ({...prevState, [`${name}Error`]: ""}))
  }

  const validate = () =>{
    let error = false;
    if(email.length === 0) {
      setState(prevState => ({...prevState, emailError: convertError('email.required')}));
      error = true;
    } else if(!validateEmail(email)){
      setState(prevState => ({...prevState, emailError: convertError('email.invalid')}));
      error = true;
    }
    return !error;
  }

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if(validate()) {
      dispatch(forgotPassword(email, ()=>{
        setCookie('email_address', email, { maxAge: 600 });
        navigate('/verifyOtp', {replace: true});
      }));
    }
  };

  const loading = authStatus === AUTH_STATUS.INPROGRESS;
  return (
      <>
        <div className="form-section">
          <div className="back-btn mb-4">
            <Link to={'/login'} className={`d-flex align-content-center ${loading ? "disabled" : ""}`}>
              <img src={Images.BackSvg} className="me-2" alt=""/> Back
            </Link>
          </div>
          <h2>Forgot Password</h2>
          <p>Don't worry, it happens. Let us know your email address and we'll send you an
            email with instructions.</p>
          {errorMsg !== '' && <Alert severity="error">{errorMsg}!</Alert>}
          {successMsg !== '' && <Alert severity="success">{successMsg}!</Alert>}
          <form>
            <div className="form-outline mb-4">
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
