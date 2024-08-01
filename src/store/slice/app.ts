import { createSlice } from "@reduxjs/toolkit";

export interface AppSliceProps {
  isLoading: boolean;
}

const initialState = {
  isLoading: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppLoading: (state) => {
      state.isLoading = true;
    },
    resetAppLoading: (state) => {
      state.isLoading = false;
    },
  },
});

export const { setAppLoading, resetAppLoading } = appSlice.actions;
export const selectApp = (state: { app: AppSliceProps }) => state.app;
export default appSlice.reducer;
