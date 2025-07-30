import { configureStore } from '@reduxjs/toolkit';
import userProgressReducer from './userProgressSlice';
import prelimsQuestionSlice from './slices/prelimsQuestionSlice';
import themeSlice from './slices/themeSlice';
import archivedQuestionsReducer from './slices/archivedQuestionsSlice'

export const store = configureStore({
  reducer: {
    userProgress: userProgressReducer,
    prelimsQuestion: prelimsQuestionSlice,
    theme: themeSlice,
    archivedQuestions: archivedQuestionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
