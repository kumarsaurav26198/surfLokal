import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import AsyncStorage from '@react-native-community/async-storage';
import BASEURl from '../services/Api'

const Header = {
  security_key: "SurfLokal52"
}
export const loginPhoneUser = createAsyncThunk('loginPhoneUser', async dispatch => {
  return await uploadImageAPI(
    BASEURl + 'webapi/v1/login/send_otp.php',
    dispatch,Header
  )
    .then(async response => {
      const { data } = response;
      console.log('phonedata',data)
      if (data.data.success) {
        const ids = data.data.ID;
        await AsyncStorage.setItem('userId', ids);
        await AsyncStorage.setItem('userDetails', JSON.stringify(data.data));
   
        return data;
      } else {
        return data;
      }
    })
    .catch(e => {

      if (e.response) {
      } else if (e.request) {
      } else {
      }
    });
});

const loginPhoneUserSlice = createSlice({
  name: 'loginPhoneUser',
  initialState: {
    loginPhoneUserData: {},
    status: null,
     isLoading: false,
  },
  extraReducers: {
    [loginPhoneUser.pending]: (state, action) => {
      state.status = 'loading';
      state.isLoading = true;
    },
    [loginPhoneUser.fulfilled]: (state, action) => {
      state.status = 'success';
      state.loginData = action.payload;
      state.isLoading = false
    },
    [loginPhoneUser.rejected]: (state, action) => {
      state.status = 'failed';
      state.isLoading = false;
    },
  },
});

export default loginPhoneUserSlice.reducer;
