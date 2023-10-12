import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURL from '../services/Api';

export const verifyOTP = createAsyncThunk('verifyOTP', async data => {
  const Header={
    'security_key' : data.data.security_key,
    'access_token': data.data.access_token
  }
  return await uploadImageAPI(BASEURL + 'webapi/v1/login/verify_otp.php', data.data.data)
    .then(async (response) => {
      const { res } = response
      console.log('verifyOtp', JSON.stringify(res)+"   "+JSON.stringify(data.data.data));
      // if (res.status) {
      //   return data;
      // } else {
      //   return data;
      // }
    })
    .catch((e) => {
      console.log('verifyOtp--',response)
      if (e.response) { 
      } else if (e.request) {
      } else {
      }
    });
});

const verifyOTPSlice = createSlice({
  name: 'verifyOTP',
  initialState: {
    verifyOTPData:{},
    status: null,
    isLoading: false,
  },
  extraReducers: {
    [verifyOTP.pending]: (state, action) => {
      state.status = 'loading';
      state.isLoading = true;
    },
    [verifyOTP.fulfilled]: (state, action) => {
      state.status = 'success';
      state.loginData = action.payload;
      state.isLoading = false;
    },
    [verifyOTP.rejected]: (state, action) => {
      state.status = 'failed';
      state.isLoading = false;
    },
  },
});

export default verifyOTPSlice.reducer;

