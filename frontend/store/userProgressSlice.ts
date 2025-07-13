import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserProgressState {
    streak: number;
    totalPoints: number;
}


const initialState: UserProgressState = {
    streak: 0,
    totalPoints: 0
};

const userProgressSlice = createSlice({
    name: 'userProgress',
    initialState,
    reducers: {
        setStreak(state){
            state.streak += 1;
        },
        addPoints(state, action: PayloadAction<number>){
            state.totalPoints += action.payload;
        },
        resetStreak(state){
            state.streak = 0;
        },
    },
});

export const { setStreak, addPoints, resetStreak } = userProgressSlice.actions;
export default userProgressSlice.reducer;