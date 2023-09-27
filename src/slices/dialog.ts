import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
interface DialogState {
  open: boolean;
  properties: object | null;
}

interface PropertyPayload {
  config: object;
  options: object;
}

// Define the initial state using that type
const initialState: DialogState = {
  open: false,
  properties: null
};

export const dialogSlice = createSlice({
  name: 'dialog',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    openDialog: (state,action: PayloadAction<PropertyPayload>) => {
      state.open = true;
      state.properties = { ...action.payload.config, ...action.payload.options };
    },
    closeDialog: (state) => {
      state.open = false;
      state.properties = null;
    },
  },
});

export const {
  openDialog,
  closeDialog
} = dialogSlice.actions;

export default dialogSlice.reducer;
