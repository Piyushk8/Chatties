import { configureStore } from '@reduxjs/toolkit';
import api from './reducers/api';
import authReducer, { authSlice } from "../redux/reducers/auth"
import miscSlice from './reducers/misc';
import chatSlice from './reducers/chat';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [api.reducerPath]:api.reducer,
    [miscSlice.name]:miscSlice.reducer,
    [authSlice.name]:authSlice.reducer,
    [chatSlice.name]:chatSlice.reducer
    // Add other reducers here
  },
  middleware:(mid)=>[...mid(),api.middleware]
});

export default store;
