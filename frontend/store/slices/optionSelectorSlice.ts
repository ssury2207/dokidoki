import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OptionSelectorState {
  actionOption: number | null;
}

const initialState: OptionSelectorState = {
  actionOption: null,
};

const optionSelectorSlice = createSlice({
  name: 'optionSelector',
  initialState,
  reducers: {
    setSelectedOption(state, action: PayloadAction<number>) {
      state.actionOption = action.payload;
    },
    resetSelectedOption(state) {
      state.actionOption = null;
    },
  },
});

export const { setSelectedOption, resetSelectedOption } =
  optionSelectorSlice.actions;
export default optionSelectorSlice.reducer;
