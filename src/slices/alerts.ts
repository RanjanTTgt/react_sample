import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { AppDispatch } from '../store';

// Define a type for the slice state
interface Alert {
  type: string;
  code?: number;
  skip?: boolean;
  message: string;
}

interface AlertState {
  alerts: Alert[];
}

// Define the initial state using that type
const initialState: AlertState = {
  alerts: []
};

export const alertSlice = createSlice({
  name: 'alerts',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    clearAll: (state) => {
      state.alerts = []
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts = [...state.alerts, action.payload];
    },
    deleteAlert: (state) => {
      state.alerts = [...state.alerts.slice(1, state.alerts.length)];
    },
    deleteAlertByIndex: (state, action: PayloadAction<number>) => {
      state.alerts = [...state.alerts.slice(0, action.payload).concat(...state.alerts.slice(action.payload + 1))];
    },
  },
});

export const {
  clearAll,
  addAlert,
  deleteAlert,
  deleteAlertByIndex
} = alertSlice.actions;

export const pushAlertMessage = (payload: Alert, time?: number | null) => async (dispatch: AppDispatch) => {
  dispatch(addAlert(payload));
  setTimeout(()=>dispatch(deleteAlert()), time ?? 5000);
}

export default alertSlice.reducer;
