import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    Loader:true
    ,isAuthenticated:false
  },

  reducers: {
    userExists:(state,action)=>{
        state.user=action.payload
        state.Loader=false
    },
    userNotExists:(state)=>{
        state.user=null,
        state.Loader=false
    },
    setIsAuthenticated:(state,action)=>{
        state.isAuthenticated=action.payload
    },

  },
});

export const { setIsAuthenticated, userExists,userNotExists } = authSlice.actions;

export default authSlice.reducer;
