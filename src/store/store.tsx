import * as React from "react";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import accountReducer from "./slice/account";
import folderReducer from "./slice/folder";
import libraryReducer from "./slice/library";
import appReducer from "./slice/app";
import { Provider } from "react-redux";

const RootReducer = combineReducers({
  app: appReducer,
  account: accountReducer,
  folder: folderReducer,
  library: libraryReducer,
});

const store = configureStore({
  reducer: RootReducer,
});

export const StoreProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);
