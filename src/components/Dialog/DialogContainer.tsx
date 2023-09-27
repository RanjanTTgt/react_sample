import Dialog from "./Dialog";
import { useAppSelector } from "../../hooks";

const DialogContainer = () => {
    const dialog = useAppSelector((state) => state.dialog);

    if (dialog && dialog.open) {
        return <Dialog {...dialog.properties} />
    }

    return null;
}

export default DialogContainer;