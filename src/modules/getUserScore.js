import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
export const getUserScore = createAsyncThunk('getUserScore', (meterValue) => {
   return meterValue
});

const getUserScoreSlice = createSlice({
  name: 'getUserScore',
  initialState: {
    getUserScoreData: 0,
    status: null,
  },
  extraReducers: {
    [getUserScore.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getUserScore.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getUserScoreData = action.payload;
    },
    [getUserScore.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getUserScoreSlice.reducer;