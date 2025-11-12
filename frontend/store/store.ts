import { configureStore, combineReducers } from '@reduxjs/toolkit';
import userProgressReducer from './userProgressSlice';
import prelimsQuestionSlice from './slices/prelimsQuestionSlice';
import themeSlice from './slices/themeSlice';
import optionSelectorSlice from './slices/optionSelectorSlice';

const appReducer = combineReducers({
  userProgress: userProgressReducer,
  prelimsQuestion: prelimsQuestionSlice,
  theme: themeSlice,
  optionSelector: optionSelectorSlice,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STORE') {
    // Keep only theme state
    const { theme } = state;
    state = { theme };
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof appReducer>;
export type AppDispatch = typeof store.dispatch;
