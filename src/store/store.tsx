import * as React from "react";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import accountReducer from "./slice/account";
import folderReducer from "./slice/folder";
import { Provider } from "react-redux";

const RootReducer = combineReducers({
  account: accountReducer,
  folder: folderReducer,
});

const store = configureStore({
  reducer: RootReducer,
});

export const StoreProvider = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);
