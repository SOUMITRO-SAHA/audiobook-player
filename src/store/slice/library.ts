import { createSlice } from "@reduxjs/toolkit";

export interface LibrarySliceProps {
  libraryLoading: boolean;
}

const initialState = {
  libraryLoading: false,
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setLibraryLoading: (state) => {
      state.libraryLoading = true;
    },
    resetLibraryLoading: (state) => {
      state.libraryLoading = false;
    },
  },
});

export const { setLibraryLoading, resetLibraryLoading } = librarySlice.actions;
export const selectLibrary = (state: { library: LibrarySliceProps }) =>
  state.library;
export default librarySlice.reducer;
