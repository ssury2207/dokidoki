import { configureStore } from "@reduxjs/toolkit";
import userProgressReducer from './userProgressSlice';



export const store = configureStore({
    reducer: {
        userProgress: userProgressReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;