import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //notificationCount: 0,
  
  pinnedChats:[],
  muteChats:[]
  ,chatSelection:"all"
 
  
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
      
    }},
    setMuteChatsArray:(state,action)=>{
      state.muteChats = action.payload
    },
   setMuteChats:(state,action)=>{
    if(!state.muteChats.includes(action.payload)) state.muteChats.push(action.payload)
   },
   deleteFromMuteChats:(state,action)=>{
    if(state.muteChats.includes(action.payload)) {
     state.muteChats =  state.muteChats.filter((i)=>i!==action.payload)
      
    }}
    ,setChatSelection:(state,action)=>{
      state.chatSelection = action.payload
    }
  },
});

export default chatSlice;
export const {
  setMuteChats,
  setMuteChatsArray,
  deleteFromMuteChats,
  setPinnedChatsArray,
  deleteFromPinnedChats,
  setChatSelection,
  setPinnedChats,
} = chatSlice.actions;