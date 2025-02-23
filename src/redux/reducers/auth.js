import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    Loader:true
    ,isAuthenticated:true
    ,onlineUsers:[]
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
    setOnlineUsers:(state,action)=>{
      state.onlineUsers = action.payload
    },
    updateOnlineUsers: (state, action) => {
      const { userId, status } = action.payload;
      if (status === "offline") {
        state.onlineUsers = state.onlineUsers.filter((id) => id !== userId);
      } else if (!state.onlineUsers.includes(userId)) {
        state.onlineUsers.push(userId);
      }
    },

  },
});

export const { setOnlineUsers,updateOnlineUsers,setIsAuthenticated, userExists,userNotExists } = authSlice.actions;

export default authSlice.reducer;
