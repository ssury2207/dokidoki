import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface prelimsQuestionState {
  question: string;
  options: string[];
  actualOption: string;
  expectedOption: string;
}

const initialState: prelimsQuestionState = {
  question: '',
  options: [],
  actualOption: '',
  expectedOption: '',
};

const prelimsQuestionSlice = createSlice({
  name: 'prelimsQuestion',
  initialState,
  reducers: {
    setQuestion(state, action: PayloadAction<string>) {
      state.question = action.payload;
    },
    setOptions(state, action: PayloadAction<string[]>) {
      state.options = action.payload;
    },
    setActualOption(state, action: PayloadAction<string>) {
      state.actualOption = action.payload;
    },
    setExpectedOption(state, action: PayloadAction<string>) {
      state.expectedOption = action.payload;
    },
  },
});

export const { setQuestion, setOptions, setActualOption, setExpectedOption } =
  prelimsQuestionSlice.actions;
export default prelimsQuestionSlice.reducer;
