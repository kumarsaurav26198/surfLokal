import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {  uploadImageAPI } from '../config/apiMethod';
import BASEURl from '../services/Api'

export const schoolChat = createAsyncThunk('schoolChat', async dispatch=> {
   console.log(dispatch)
  try {
    const response = await uploadImageAPI(
      BASEURl+`wp-json/chatbot/SchoolChatBot`,
      dispatch,
    ).then((res) => {
      return res;
    }).catch((e) => {
      return e
    })


    return response;
  } catch (error) {
    throw error; 
  }
});

const schoolChatSlice = createSlice({
  name: 'schoolChat',
  initialState: {
    schoolChatData: [],
    status: null,
  },
  extraReducers: {
    [schoolChat.pending]: (state, action) => {
      state.status = 'loading';
      state.schoolChatData = action.payload;

    },
    [schoolChat.fulfilled]: (state, action) => {
      state.status = 'success';
      state.schoolChatData = action.payload;
    },
    [schoolChat.rejected]: (state, action) => {
      state.status = 'failed';
      state.schoolChatData = action.payload;

    },
  },
});

export default schoolChatSlice.reducer;
