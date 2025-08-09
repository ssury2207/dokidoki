import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface themeState {
  isLight: boolean;
}

const initialState: themeState = {
  isLight: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<boolean>) {
      state.isLight = action.payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
