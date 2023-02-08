import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import formulaSlice from './features/Formula/formulaSlice';

export const store = configureStore({
    reducer: {
        formula: formulaSlice
    }
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootState = ReturnType<typeof store.getState>