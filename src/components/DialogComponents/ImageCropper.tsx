import React, { useEffect, useRef, useState } from "react";
import { dataUrlToFile, LoaderButtonIcon } from "../../helper";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import * as Images from "../../assets/images";
import { useAppDispatch } from "../../hooks";

interface ImageCropperInterface {
    image: File;
    title: string;
    initialAspectRatio?: number;
    aspectRatio?: number,
    enableZoom?: boolean,
    close: VoidFunction;
    submit: (file: File) => void,
}

const ImageCropper = (props: ImageCropperInterface) => {
    const dispatch = useAppDispatch()

    const { image, title, initialAspectRatio, aspectRatio, enableZoom, submit, close } = props;

    const cropperRef = useRef<ReactCropperElement>(null);
    const [state, setState] = useState<any>({
        minZoom: 0, zoom: 0, isReady: false, src: null, loading: false
    });

    useEffect(() => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setState({...state, src: reader.result});
        });
        reader.readAsDataURL(image);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [image]);

    const handleRange = (event: any) => {
        handleZoom(event.target.value);
    }

    const cropImage = async () => {
        await setState(prevState => ({...prevState, loading: true}));
        await timeout(500);
        const imageElement: any = cropperRef?.current;
        const cropper: any = imageElement?.cropper;
        if (!cropper) {
            setState(prevState => ({...prevState, loading: false}));
            return null
        }
        let croppedCanvas = cropper.getCroppedCanvas();
        const dataURL = croppedCanvas.toDataURL('image/jpg');
        const file = await dataUrlToFile(dataURL, image?.name ?? "image");
        submit(file);
        await setState(prevState => ({...prevState, loading: false}));
        close();
    }

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleZoom = (zoomValue: number | string) => {
        const imageElement: any = cropperRef?.current;
        const cropper: any = imageElement?.cropper;
        if (!cropper) return null;
        if (typeof zoomValue === "string") {
            zoomValue = parseInt(zoomValue);
        }
        cropper.zoomTo(zoomValue);
        setState({...state, zoom: zoomValue});
    }

    return (
        <>
            <h4 className="d-flex align-items-center">
                {title}
            </h4>

            <div className="image-cropper-div mt-4">
                <div className="image-cropper-inner-div">
                    {
                        state.src &&
                        <Cropper className={"image-cropper-img"}
                                 src={state.src}
                                 initialAspectRatio={initialAspectRatio}
                                 aspectRatio={aspectRatio}
                                 viewMode={2}
                                 autoCropArea={1}
                                 dragMode="move"
                                 modal={true}
                                 restore={false}
                                 autoCrop={true}
                                 guides={false}
                                 cropBoxMovable={true}
                                 cropBoxResizable={true}
                                 minCropBoxHeight={50}
                                 minCropBoxWidth={100}
                                 background={false}
                                 toggleDragModeOnDblclick={false}
                                 zoomOnTouch={false}
                                 zoomOnWheel={false}
                                 center={false}
                                 ready={() => setState({...state, isReady: true})}
                                 crossOrigin="anonymous"
                                 checkCrossOrigin={false}
                                 ref={cropperRef}/>
                    }
                    <>
                        {enableZoom &&
                        <div className="d-flex justify-content-center py-3">
                            <span className={(!state.isReady || state.zoom <= state.minZoom || state.loading) ? 'disabled' : 'cursor-pointer'}
                                    onClick={() => handleZoom(--state.zoom)}>
                                <img src={Images.ZoomOut} />
                            </span>

                            <input type="range"
                                   disabled={!state.isReady || state.loading}
                                   min={state.minZoom}
                                   max={state.minZoom + 10}
                                   value={state.zoom}
                                   className="mx-3 cursor-pointer background-theme"
                                   onChange={handleRange}/>

                            <span className={(!state.isReady || state.zoom >= state.minZoom + 10 || state.loading) ? 'disabled' : 'cursor-pointer'}
                                  onClick={() => handleZoom(++state.zoom)}>
                                <img src={Images.ZoomIn} />
                            </span>
                        </div>
                        }

                    </>
                </div>
                <div>
                    <div className="image-cropper-footer pt-2">
                        <button className="btn btn-outline me-3" onClick={() => close()}>
                            Cancel
                        </button>
                        <button className="btn btn-primary me-3"
                                onClick={cropImage}
                                disabled={!state.isReady || state.loading}>
                            Crop
                            <LoaderButtonIcon loading={state.loading}/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ImageCropper;