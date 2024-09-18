import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //notificationCount: 0,
  
  pinnedChats:[]
  ,
 
  
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setPinnedChatsArray:(state,action)=>{
      state.pinnedChats = action.payload
    },
   setPinnedChats:(state,action)=>{
    if(!state.pinnedChats.includes(action.payload)) state.pinnedChats.push(action.payload)
   },
   deleteFromPinnedChats:(state,action)=>{
    if(state.pinnedChats.includes(action.payload)) {
     state.pinnedChats =  state.pinnedChats.filter((i)=>i!==action.payload)
      
    }}
  },
});

export default chatSlice;
export const {setPinnedChatsArray,
  deleteFromPinnedChats,
  setPinnedChats,
} = chatSlice.actions;