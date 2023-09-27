import { useAppDispatch, useAppSelector } from "../../hooks";
import { convertError } from "../../utils/convertError";
import { SnackbarContent } from "@mui/material";
import { deleteAlertByIndex } from "../../slices/alerts";


const Toaster = () => {
    const dispatch = useAppDispatch();
    const alerts = useAppSelector((state) => state.alerts.alerts);

    const deleteAlert = (index: number) =>{
        dispatch(deleteAlertByIndex(index));
    };

    return (
        <div className="toaster-main-div">
            {
                alerts.map((record, k) => {
                    if(!record.skip){
                        return(
                            <div key={k} onClick={() => deleteAlert(k)} className="toaster-class">
                                <ToasterMessage message={convertError(record.message)}
                                                type={record.type as 'error' | 'warning' | 'success'} />
                            </div>
                        )
                    }
                })
            }
        </div>
    );

}


type Props =  {
    type: string;
    message: string;
}

const ToasterMessage = (props: Props) => {
    const {message, type} = props;

    return (
        <SnackbarContent
            className={`snackbar-${type}`}
            message={
                <span id="client-snackbar" className={`snackbar-message`}>
                    {message}
                  </span>
            }
        />
    );
}

export default Toaster;
