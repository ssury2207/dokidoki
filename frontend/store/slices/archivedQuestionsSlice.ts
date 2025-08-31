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
  prelimsData: ArchivedQuestion[];
  loading: boolean;
  error: string | null;
}

const initialState: ArchivedQuestionsState = {
  data: [],
  prelimsData: [],
  loading: false,
  error: null,
};

// ✅ Unified thunk to fetch both mains and prelims
export const fetchArchivedQuestions = createAsyncThunk(
  'archivedQuestions/fetchArchivedQuestions',
  async (_, thunkAPI) => {
    try {
      const archiveData = await getArchiveQuestions();
      const today = new Date().toISOString().substring(0, 10);
      const mains = archiveData.mains.filter(
        (val: ArchivedQuestion) => val.date !== today
      );
      const prelims = archiveData.prelims.filter(
        (val: ArchivedQuestion) => val.date !== today
      );
      return { mains, prelims };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.message || 'Failed to fetch archive questions'
      );
    }
  }
);

const archivedQuestionsSlice = createSlice({
  name: 'archivedQuestions',
  initialState,
  reducers: {
    setArchivedQuestions(state, action: PayloadAction<ArchivedQuestion[]>) {
      state.data = action.payload;
    },
    setArchivedPrelims(state, action: PayloadAction<ArchivedQuestion[]>) {
      state.prelimsData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArchivedQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchArchivedQuestions.fulfilled,
        (
          state,
          action: PayloadAction<{
            mains: ArchivedQuestion[];
            prelims: ArchivedQuestion[];
          }>
        ) => {
          state.data = action.payload.mains;
          state.prelimsData = action.payload.prelims;
          state.loading = false;
        }
      )
      .addCase(fetchArchivedQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setArchivedQuestions, setArchivedPrelims } =
  archivedQuestionsSlice.actions;

export default archivedQuestionsSlice.reducer;

// ✅ Selectors
export const selectArchivedQuestions = (state: {
  archivedQuestions: ArchivedQuestionsState;
}) => state.archivedQuestions.data;

export const selectArchivedPrelimsQuestions = (state: {
  archivedQuestions: ArchivedQuestionsState;
}) => state.archivedQuestions.prelimsData;

export const selectArchivedQuestionsLoading = (state: {
  archivedQuestions: ArchivedQuestionsState;
}) => state.archivedQuestions.loading;

export const selectArchivedQuestionsError = (state: {
  archivedQuestions: ArchivedQuestionsState;
}) => state.archivedQuestions.error;
