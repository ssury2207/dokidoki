import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface themeState {
  isLight: boolean;
}

const initialState: themeState = {
  isLight: true,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<boolean>) {
      state.isLight = action.payload;
    },
    toggleTheme(state) {
      state.isLight = !state.isLight;
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
