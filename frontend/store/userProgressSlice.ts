import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProgressState {
  userName: string | null;
  streak: {
    longest_streak: number;
    current_streak: number;
    last_active_date: string;
    dates_active: object;
  };
  totalPoints: number;
}

const initialState: UserProgressState = {
  userName: '',
  streak: {
    longest_streak: 0,
    current_streak: 0,
    last_active_date: '',
    dates_active: {},
  },
  totalPoints: 0,
};

const userProgressSlice = createSlice({
  name: 'userProgress',
  initialState,
  reducers: {
    setUserName(state, action: PayloadAction<string>) {
      state.userName = action.payload;
    },
    setStreak(state) {
      state.streak.current_streak += 1;
    },
    setPoints(state, action: PayloadAction<number>) {
      state.totalPoints = action.payload;
    },
    addPoints(state, action: PayloadAction<number>) {
      state.totalPoints += action.payload;
    },
    resetStreak(state) {
      state.streak.current_streak = 0;
    },
  },
});

export const { setStreak, addPoints, setUserName, setPoints, resetStreak } =
  userProgressSlice.actions;
export default userProgressSlice.reducer;
