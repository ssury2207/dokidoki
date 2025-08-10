import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OptionSelectorState {
  actionOption: number | null;
  disableSelector: boolean;
}

const initialState: OptionSelectorState = {
  actionOption: null,
  disableSelector: false,
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
    setDisableSelector(state) {
      state.disableSelector = true;
    },
  },
});

export const { setSelectedOption, setDisableSelector, resetSelectedOption } =
  optionSelectorSlice.actions;
export default optionSelectorSlice.reducer;
