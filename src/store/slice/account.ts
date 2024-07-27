import { createSlice } from "@reduxjs/toolkit";

export interface AccountSliceProps {
  updated: boolean;
}

const initialState = {
  updated: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    updateAccount: (state) => {
      state.updated = true;
    },
    resetAccount: (state) => {
      state.updated = false;
    },
  },
});

export const { updateAccount, resetAccount } = accountSlice.actions;
export const selectAccount = (state: { account: AccountSliceProps }) =>
  state.account;
export default accountSlice.reducer;
