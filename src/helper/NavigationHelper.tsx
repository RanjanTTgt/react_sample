import React from "react";
import { Navigate } from 'react-router-dom'
import { To } from "history";
import { pushAlertMessage } from "../slices";
import { useAppDispatch } from "../hooks";

export interface NavigateProps {
    to: To;
    type: string;
    message: string;
    replace?: boolean;
    state?: any;
}

export const NavigateWithToaster = (props: NavigateProps) => {
    const { type, message, ...remainingProps } = props;
    if(type && message){
        const dispatch = useAppDispatch();
        dispatch(pushAlertMessage({type: type, message: message}))
    }
    return (<Navigate {...remainingProps}/>)
}