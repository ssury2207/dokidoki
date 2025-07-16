import { configureStore } from '@reduxjs/toolkit';
import userProgressReducer from './userProgressSlice';
import prelimsQuestionSlice from './slices/prelimsQuestionSlice';

export const store = configureStore({
  reducer: {
    userProgress: userProgressReducer,
    prelimsQuestion: prelimsQuestionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
