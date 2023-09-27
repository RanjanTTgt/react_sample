import React, {useState, useEffect, useRef} from "react";
import { useLocation, Navigate, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { AUTH_STATUS, logout } from '../../slices';
import { Copyright, Footer } from '.';
import * as Images from '../../assets/images';

export const BaseLayout = () => {
    const authStatus = useAppSelector((state) => state.auth.status);
    const location = useLocation();

    if (authStatus === AUTH_STATUS.SUCCESS) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/" state={{from: location}} replace/>;
    }

    return (
        <>
            <section className="login-page min-vh-100 position-relative">
                <div className="overlay-section d-flex w-100 position-absolute top-0 end-0 start-0 bottom-0 flex-wrap">
                    <div className="d-flex w-100 shapes--top">
                        <div className="shape1"/>
                        <div className="shape2"/>
                        <div className="shape3"/>
                    </div>
                    <div className="d-flex  w-100 shapes--bottom">
                        <div className="shape4">
                        </div>
                        <div className="shape5 ">
                        </div>
                    </div>
                </div>
                <div className="login-page-inner  min-vh-100 d-flex align-items-center ">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <Link to={'/login'} className={`logo-white ${location.pathname === '/login' ? 'disabled' : ''}`}>
                                    <img src={Images.LogoPng} alt="logo" className="react-sample-logo" />
                                </Link>
                                <h1>
                                    This is simple <span>React Sample App</span> for basic auth feature as a sample purpose.
                                </h1>
                            </div>
                            <div className="col-md-6">
                                <Outlet/>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </section>
        </>
    )
}

export const PrivateLayout = () => {
    const [buttonClick, toggleButton] = useState<boolean>(false);
    const [userFullName, setUserFullName] = useState<string>("");
    let buttonRef = useRef<HTMLButtonElement>();
    const authStatus = useAppSelector((state) => state.auth.status);
    const user = useAppSelector((state) => state.auth.userDetails);
    const location = useLocation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(()=>{
        if(user){
            setUserFullName(`${user.firstName ?? ""} ${user.lastName ?? ""}`);
        } else {
            setUserFullName(``);
        }
    },[user])

    if (authStatus === AUTH_STATUS.FAILED) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they login, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    const logoutUser = (event: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        event.preventDefault();
        dispatch(logout());
    }

    const handleButtonEvent = () =>{
        toggleButton(!buttonClick);
    }

    return (
        <>
            <header className="header-react-sample bg-white">
                <nav className="navbar navbar-expand-lg navbar-light p-0">
                    <div className="container-fluid">
                        <Link to={'/'} className="navbar-brand p-0">
                            <img src={Images.LogoPng} alt="logo" className="react-sample-logo" />
                        </Link>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                                aria-expanded="false" aria-label="Toggle navigation"
                                ref={buttonRef}
                                onClick={handleButtonEvent}>
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div className="header-nav">
                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="dropdown text-end ms-auto">
                                <Link className="d-block link-dark text-decoration-none dropdown-toggle"
                                      data-bs-toggle="dropdown"
                                      aria-expanded="false"
                                      to={'#'}>
                                    <img src={Images.DefaultAvatar} alt="" width="32" height="32"
                                         className="rounded-circle me-2 avatar-logo"/>
                                    <span className="user-fullname">{userFullName ?? "Demo User"}</span>
                                </Link>
                                <ul className="dropdown-menu text-small dropdown-menu-end"
                                    aria-labelledby="dropdownUser1">
                                    <li><Link className="dropdown-item" to={'/changePassword'}>Change Password</Link></li>
                                    <li><Link className="dropdown-item" to={'/login'} onClick={logoutUser}>Logout</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            <div className="main-layout-section">
                <Outlet />
            </div>

            <footer>
                <div className="container-fluid">
                    <div className="row">
                        <Copyright/>
                        <div className="col-sm-6 text-end">
                            <a href="#">Terms & Conditions</a> | <a href="#">Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
};