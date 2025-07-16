import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { act } from 'react';

interface prelimsQuestionState {
  question: string;
  year: number;
  paper: string;
  options: string[];
  answer: string;
  actualOption: string;
  expectedOption: string;
}

const initialState: prelimsQuestionState = {
  question: '',
  year: 0,
  paper: '',
  options: [],
  answer: '',
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
    setYear(state, action: PayloadAction<number>) {
      state.year = action.payload;
    },
    setPaper(state, action: PayloadAction<string>) {
      state.paper = action.payload;
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
    setAnswer(state, action: PayloadAction<string>) {
      state.answer = action.payload;
    },
  },
});

export const {
  setPaper,
  setYear,
  setAnswer,
  setQuestion,
  setOptions,
  setActualOption,
  setExpectedOption,
} = prelimsQuestionSlice.actions;
export default prelimsQuestionSlice.reducer;
