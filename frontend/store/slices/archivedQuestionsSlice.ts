import { getArchiveQuestions } from '@/src/api/fetchArchiveQuestions';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface ArchivedQuestion {
  id: string;
  date: string;
  questionId: string;
  question_text: string;
  paper?: string;
  year?: number;
  marks?: number;
  topic?: string;
  code?: string;
}

interface ArchivedQuestionsState {
  data: ArchivedQuestion[];
  loading: boolean;
  error: string | null;
}

const initialState: ArchivedQuestionsState = {
  data: [],
  loading: false,
  error: null,
};

// Async thunk to fetch archive questions
export const fetchArchivedQuestions = createAsyncThunk(
  'archivedQuestions/fetchArchivedQuestions',
  async (_, thunkAPI) => {
    try {
      const archiveData = await getArchiveQuestions();
      return archiveData.mains;
    } catch (error: any) {
      // Pass error message as reject payload
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch archive questions');
    }
  }
);

const archivedQuestionsSlice = createSlice({
  name: 'archivedQuestions',
  initialState,
  reducers: {
    // Optional synchronous reducers here if needed
    setArchivedQuestions(state, action: PayloadAction<ArchivedQuestion[]>) {
      state.data = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchArchivedQuestions.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArchivedQuestions.fulfilled, (state, action: PayloadAction<ArchivedQuestion[]>) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchArchivedQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setArchivedQuestions } = archivedQuestionsSlice.actions;

export default archivedQuestionsSlice.reducer;

// Selector to consume in components
export const selectArchivedQuestions = (state: { archivedQuestions: ArchivedQuestionsState }) =>
  state.archivedQuestions.data;
export const selectArchivedQuestionsLoading = (state: { archivedQuestions: ArchivedQuestionsState }) =>
  state.archivedQuestions.loading;
export const selectArchivedQuestionsError = (state: { archivedQuestions: ArchivedQuestionsState }) =>
  state.archivedQuestions.error;
