import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {getAPI} from '../config/apiMethod';
import BASEURl from '../services/Api'
export const getRating = createAsyncThunk('getRating', async (post_id) => {
  return await getAPI(BASEURl+`webapi/v1/rating/user_rating.php?post_id=${post_id}`)
    .then(async response => {
      const {data} = response;
      return data;
    })
    .catch(e => {
      if (e.response) {
      } else if (e.request) {
      } else {
      }
    });
});

const getRatingSlice = createSlice({
  name: 'getRating',
  initialState: {
    getRatingData: [],
    status: null,
  },
  extraReducers: {
    [getRating.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getRating.fulfilled]: (state, action) => {
      state.status = 'success';
      state.getRatingData = action.payload;
    },
    [getRating.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default getRatingSlice.reducer;
