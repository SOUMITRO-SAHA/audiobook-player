import { createSlice } from "@reduxjs/toolkit";

export interface FolderSliceProps {
  loading: boolean;
}

const initialState = {
  loading: false,
};

const folderSlice = createSlice({
  name: "folder",
  initialState,
  reducers: {
    setIsLoading: (state) => {
      state.loading = true;
    },

    resetIsLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { setIsLoading, resetIsLoading } = folderSlice.actions;
export const selectFolder = (state: { folder: FolderSliceProps }) =>
  state.folder;
export default folderSlice.reducer;
