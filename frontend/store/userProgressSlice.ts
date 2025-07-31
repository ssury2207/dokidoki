import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProgressState {
  userName: string | null;
  longest_streak: number;
  current_streak: number;
  last_active_date: string;
  totalPoints: number;
}

const initialState: UserProgressState = {
  userName: '',
  longest_streak: 0,
  current_streak: 0,
  last_active_date: '',
  totalPoints: 0,
};

const userProgressSlice = createSlice({
  name: 'userProgress',
  initialState,
  reducers: {
    setUserName(state, action: PayloadAction<string>) {
      state.userName = action.payload;
    },
    setCurrentStreak(state, action: PayloadAction<number>) {
      state.current_streak = action.payload;
    },
    setLongestStreak(state) {
      state.longest_streak += 1;
    },
    setLastActiveDate(state, action: PayloadAction<string>) {
      state.last_active_date = action.payload;
    },
    resetStreak(state) {
      state.current_streak = 0;
    },
    setPoints(state, action: PayloadAction<number>) {
      state.totalPoints = action.payload;
    },
    addPoints(state, action: PayloadAction<number>) {
      state.totalPoints += action.payload;
    },
  },
});

export const {
  setCurrentStreak,
  setLongestStreak,
  setLastActiveDate,
  addPoints,
  setUserName,
  setPoints,
  resetStreak,
} = userProgressSlice.actions;
export default userProgressSlice.reducer;
