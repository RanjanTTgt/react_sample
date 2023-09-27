import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type { AppDispatch } from '../store';

// Define a type for the slice state
interface AnimationState {
    animation: boolean;
    message: string;
}

// Define the initial state using that type
const initialState: AnimationState = {
    animation: false,
    message: ""
};

export const animatedSlice = createSlice({
    name: 'animation',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        animated: (state, action: PayloadAction<AnimationState>) => {
            state.animation = action.payload.animation;
            state.message = action.payload.message;
        },
    },
});

const {
    animated,
} = animatedSlice.actions;

export const startAnimation = (message?: string) => async (dispatch: AppDispatch) => {
    dispatch(animated({animation: true, message: message ?? ""}));
}
export const stopAnimation = () => async (dispatch: AppDispatch) => {
    dispatch(animated({animation: false, message: ""}));
}

export default animatedSlice.reducer;
