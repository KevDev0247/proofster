import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import formulaSlice from "./slices/formulaSlice";
import algorithmSlice from "./slices/algorithmSlice";
import globalSlice from "./slices/globalSlice";
import workspaceSlice from './slices/workspaceSlice';

export const store = configureStore({
  reducer: {
    global: globalSlice,
    formula: formulaSlice,
    algorithm: algorithmSlice,
    workspace: workspaceSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;
