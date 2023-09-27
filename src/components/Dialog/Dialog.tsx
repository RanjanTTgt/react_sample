import { useEffect } from "react";
import { useAppDispatch } from "../../hooks";
import { closeDialog } from "../../slices";
import * as Images from '../../assets/images';

const Dialog = (props: any) => {

    const dispatch = useAppDispatch();

    const close = () => {
        dispatch(closeDialog());
    };

    const {className, component, ...otherProps} = props;

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.addEventListener('keyup', closeOnEscape);
        return () => {
            document.body.style.overflow = 'scroll';
            document.removeEventListener('keyup', closeOnEscape);
        }
    }, []);


    const closeOnEscape = (event: any) => {
        if (event?.keyCode === 27) {
            close();
        }
    }

    const DialogComponent = component;
    return (
        <>
            <div className={`modal fade show wkModal display-block ${className ?? ''}`}
                 id="lostData" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <button type="button"
                                className="btn-close"
                                onClick={() => close()}
                                aria-label="Close">
                            <img src={Images.CrossGraySvg}/>
                        </button>
                        <div className="modal-body">
                            <DialogComponent close={close} {...otherProps} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop fade show"></div>
        </>
    )
}

export default Dialog;