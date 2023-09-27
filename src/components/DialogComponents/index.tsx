import ConfirmationBox from "./ConfirmationBox";
import ShareProduct from "./ShareProduct";
import DeleteProduct from "./DeleteProduct";
import AddIngredients from "./AddIngredients";
import EditIngredient from "./EditIngredient";
import ImageCropper from "./ImageCropper";

export const ADD_INGREDIENTS = {
    component: AddIngredients,
    title: "Add Ingredients",
    className: 'max500'
}

export const IDENTIFY_INGREDIENTS = {
    component: AddIngredients,
    title: "Identify Ingredients",
    className: 'max500'
}

export const EDIT_INGREDIENT = {
    component: EditIngredient,
    className: 'max500'
}

export const CONFIRMATION_BOX = {
    component: ConfirmationBox,
    title: "Confirmation Alert",
    className: 'max500'
}

export const SHARE_PRODUCT = {
    component: ShareProduct,
    className: 'max500'
}

export const DELETE_PRODUCT = {
    component: DeleteProduct,
    className: 'max380'
}


export const CROP_IMAGE = {
    title: "Crop Image",
    component: ImageCropper,
    className: 'max720'
}



