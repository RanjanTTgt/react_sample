import _ from "lodash";
import React, {useEffect, useState} from "react";
import * as Images from "../assets/images";
import {convertError} from "../utils";
import imageCompression from 'browser-image-compression';

type MessageType = 'error' | 'success' | 'info' | 'primary' | 'warning';
type ErrorDivType = {
    message: string;
    className?: string;
    type: MessageType;
}

export const MessageAlertDiv = ({message, type, className}: ErrorDivType) => {
    if(!message) return(<></>);
    let typeConvert;
    switch(type){
        case "error": {
            typeConvert = 'danger';
            break;
        }
        default: {
            typeConvert = type;
            break;
        }
    }

    return (
        <p className={`mt-1 ms-3 text-${typeConvert} ${className ?? ""}`}>
            {convertError(message)}
        </p>
    )
}

type LoadingButtonType = {
    loading: boolean;
    type?: "opacity0" | "invisible";
}

export const LoaderButtonIcon = ({loading, type}: LoadingButtonType) => {
    if(type && type === "opacity0"){
        return (<i className={`fa fa-refresh fa-spin ms-2 ${loading ? '' : 'opacity-0'}`}/>)
    } else {
        if(!loading) return(<></>);
        return (<i className={`fa fa-refresh fa-spin ms-2`}/>)
    }
}

interface LoaderProps {
    loading: boolean;
    className?: string;
}

export const Loader = ({loading, className}: LoaderProps) =>{
    if (loading){
        return(
            <div className={`loading-overlay ${className ?? ""}`}>
                <img src={Images.SpinSvg} />
            </div>
        )
    }
    return null;
}


export function Camelize(name: string){
    if(typeof(name) === "string"){
        const names = name.split(" ");
        return(_.map(names,(nameValue)=>{
            return(" " + nameValue).toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, function(match, chr)
            {
                return chr.toUpperCase();
            });
        }).join(" "));
    }
    return "";
}