import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchTodaysPrelimsQuestion } from '@/src/api/dailyPrelimsQuestion';

export interface PrelimsQuestion {
  date: string;
  questionId: string;
  Question: string;
  Chapters: string;
  Answer: string;
  Explanation: string;
  Options: string[];
  Section: string;
  Table: any[] | null;
  Year: string;
}

interface DailyPrelimsQuestionState {
  data: PrelimsQuestion | null;
  loading: boolean;
  error: string | null;
}

const initialState: DailyPrelimsQuestionState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDailyPrelimsQuestion = createAsyncThunk(
  'dailyPrelimsQuestion/fetchDailyPrelimsQuestion', 
  async (_, thunkAPI) => {
    try {
      const PreQuestionData = await fetchTodaysPrelimsQuestion();

      // Type assertion to help TypeScript understand the expected structure
      const data = PreQuestionData as Partial<PrelimsQuestion> & { id?: string };

      if (
        data &&
        typeof data.id === 'string' &&
        typeof data.Question === 'string' &&
        typeof data.Chapters === 'string' &&
        typeof data.Answer === 'string' &&
        typeof data.Explanation === 'string' &&
        Array.isArray(data.Options) &&
        typeof data.Section === 'string' &&
        ('Table' in data) &&
        typeof data.Year === 'string'
      ) {
        // Map API response to PrelimsQuestion interface
        const mappedData: PrelimsQuestion = {
          date: data.date ?? '',
          questionId: data.id,
          Question: data.Question,
          Chapters: data.Chapters,
          Answer: data.Answer,
          Explanation: data.Explanation,
          Options: data.Options,
          Section: data.Section,
          Table: data.Table ?? null,
          Year: data.Year,
        };
        return mappedData;
      } else {
        throw new Error('Invalid PrelimsQuestion data structure');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.message || 'Failed to fetch today\'s Prelims question'
      );
    }
  }
);

const prelimsQuestionSlice = createSlice({
  name: 'prelimsQuestion',
  initialState,
  reducers: {}, 
  extraReducers: builder => {
    builder
      .addCase(fetchDailyPrelimsQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyPrelimsQuestion.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDailyPrelimsQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch question';
      });
  },
});

export default prelimsQuestionSlice.reducer;

export const selectDailyPrelimsQuestion = (state: any) => state.prelimsQuestion.data;
export const selectDailyPrelimsQuestionLoading = (state: any) => state.prelimsQuestion.loading;
export const selectDailyPrelimsQuestionError = (state: any) => state.prelimsQuestion.error;
