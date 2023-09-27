import { useAppSelector } from "../../hooks";
import { Loader } from "../../helper";

const Animation = () => {
    const loading = useAppSelector((state) => state.animation.animation);
    const text = useAppSelector((state) => state.animation.message);
    return (
        <>
            <Loader loading={loading} className="fixed"/>
            {text}
        </>
    )
}

export default Animation;
