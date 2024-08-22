import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    Loader:true
  },
  reducers: {
    userExists:(state,action)=>{
        state.user=action.payload
        state.Loader=false
    },
    userNotExists:(state)=>{
        state.user=null,
        state.Loader=false
    }
  },
});

export const { userExists,userNotExists } = authSlice.actions;

export default authSlice.reducer;
