import React, {useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import {verifyOtp, AUTH_STATUS, setDefaultState, pushAlertMessage, forgotPassword} from '../../slices';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { convertError } from "../../utils";
import {useCookies} from "react-cookie";
import * as Images from "../../assets/images";
import {LoaderButtonIcon} from "../../helper";

interface IObjectKeys {
  [key: string]: any;
}

interface VerifyOtpStateType extends IObjectKeys {
  otp: string;
  otpError: string;
  verifyLoader: boolean;
}

export const VerifyOtp = () => {
  const authStatus = useAppSelector((state) => state.auth.status);
  const errorMsg = useAppSelector((state) => state.auth.errorMsg);
  const successMsg = useAppSelector((state) => state.auth.successMsg);
  const [cookies, setCookie, clearCookies] = useCookies(['email_address', 'email_otp']);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  useEffect(() => {
    // Update the document title using the browser API
    dispatch(setDefaultState());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [state, setState] = useState<VerifyOtpStateType>({otp: "", otpError: "", verifyLoader: false})

  const handleChange = (e :React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setState(prevState => ({...prevState, [name]: value}))
  }

  const {otp, otpError, verifyLoader} = state;

  const checkValidation = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(value.length === 0) {
      setState(prevState => ({...prevState, [`${name}Error`]: convertError(`${name}.required`)}));
    }
  }

  const resetErrorMessage = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setState(prevState => ({...prevState, [`${name}Error`]: ""}))
  }

  const validate = () =>{
    let error = false;
    if(otp.length === 0) {
      setState(prevState => ({...prevState, otpError: convertError('otp.required')}));
      error = true;
    }
    return !error;
  }

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const email = cookies.email_address;
    if(!email) {
      dispatch(pushAlertMessage({type: 'error', message: "otp.expired"}));
      navigate('/forgotPassword', {replace: true});
    } else if(validate()) {
      const email = cookies.email_address;
      setState((prevState => ({...prevState, verifyLoader: true})));
      dispatch(verifyOtp(email, otp, ()=>{
        setCookie('email_otp', otp, { maxAge: 1200 });
        navigate('/resetPassword', {replace: true});
      }));
    }
  }

  const handleResendOtp = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const email = cookies.email_address;
    if(!email) {
      navigate('/forgotPassword', {replace: true});
    } else {
      setState((prevState => ({...prevState, verifyLoader: false})));
      dispatch(forgotPassword(email, ()=>{
        clearCookies("email_address");
        clearCookies("email_otp");
        setCookie('email_address', email, { maxAge: 600 });
      }));
    }
  }

  const loading = authStatus === AUTH_STATUS.INPROGRESS;
  return (
      <>
        <div className="form-section">
          <div className="back-btn mb-4">
            <Link to={'/forgotPassword'} className={`d-flex align-content-center ${loading ? "disabled" : ""}`}>
              <img src={Images.BackSvg} className="me-2" alt=""/> Back
            </Link>
          </div>
          <h2>Verify OTP</h2>
          {errorMsg !== '' && <Alert severity="error">{errorMsg}!</Alert>}
          {successMsg !== '' && <Alert severity="success">{successMsg}!</Alert>}
          <form>
            <div className="form-outline mb-4">
              <label className="form-label" htmlFor="form2Example1">
                OTP
              </label>
              <input type="text"
                     className={`form-control ${otpError ? "error" : ""}`}
                     name="otp"
                     placeholder="Enter OTP"
                     value={otp}
                     onFocus={resetErrorMessage}
                     onBlur={checkValidation}
                     onChange={handleChange}
                     disabled={loading}/>
              {otpError && <p className="mt-1 ms-3 text-danger">{otpError}</p>}
            </div>
            <button className="btn btn-primary btn-block mt-1 mb-2 show-top"
                    onClick={handleSubmit}
                    disabled={loading}>
              Verify
              <LoaderButtonIcon loading={loading && verifyLoader } type={"opacity0"}/>
            </button>
            <button className="btn btn-primary btn-block mt-1 mb-2 show-top"
                    onClick={handleResendOtp}
                    disabled={loading}>
              Resend
              <LoaderButtonIcon loading={loading && !verifyLoader} type={"opacity0"}/>
            </button>
          </form>
        </div>
      </>
  );
};
