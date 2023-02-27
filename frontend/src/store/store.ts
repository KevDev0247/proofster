import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import formulaSlice from "../features/Formula/formulaSlice";
import algorithmSlice from "../features/Algorithm/algorithmSlice";
import globalSlice from "./globalSlice";

export const store = configureStore({
  reducer: {
    global: globalSlice,
    formula: formulaSlice,
    algorithm: algorithmSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>;
