import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'
import AsyncStorage from '@react-native-community/async-storage';
const Header = {
  security_key: "SurfLokal52"
}
export const googleUser = createAsyncThunk('googleUser', async dispatch => {
  return await uploadImageAPI( BASEURl + 'webapi/v1/login/emaillogin.php', 
  dispatch,Header)
    .then(async response => {
      const { data } = response;
      console.log('google ', data)
      if (data.data.success) {
        const ids = data.data.ID;
        await AsyncStorage.setItem('userId', ids + '');
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

const googleUserSlice = createSlice({
  name: 'google',
  initialState: {
    loginData: {},
    status: null,
    isLoading: false,
  },
  extraReducers: {
    [googleUser.pending]: (state, action) => {
      state.status = 'loading';
      state.isLoading = true;
    },
    [googleUser.fulfilled]: (state, action) => {
      state.status = 'success';
      state.loginData = action.payload;
      state.isLoading = false
    },
    [googleUser.rejected]: (state, action) => {
      state.status = 'failed';
      state.isLoading = false;
    },
  },
});

export default googleUserSlice.reducer;
