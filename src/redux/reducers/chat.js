import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  unreadChats: [], // Stores both chat and group unread counts
  pinnedChats: [],
  muteChats: [],
  chatSelection: "all",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUnreadChats: (state, action) => {
      state.unreadChats = action.payload?.flatMap((item) => {
        if (item.chat && item?.unreadCount>0) {
          return {
            id: item.chat.id,
            type: "chat",
            count: item.unreadCount,
          };
        } else if (item.group && item?.unreadCount>0)  {
          return {
            id: item.group.id,
            type: "group",
            count: item.group.unreadCount,
          };
        }
        return [];
      });
    },
    updateUnreadCount: (state, { payload }) => {
      const updatedChats = state.unreadChats.filter((c) => c.id !== payload.id);
      state.unreadChats = [
        { id: payload.id, type: payload.type, count: payload.unreadCount },
        ...updatedChats,
      ];
    },
    removeUnreadChat: (state, { payload }) => {
      state.unreadChats = state.unreadChats.filter((c) => c.id !== payload);
    },
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
  setUnreadChats,
  removeUnreadChat,
  updateUnreadCount,
  setMuteChats,
  setMuteChatsArray,
  deleteFromMuteChats,
  setPinnedChatsArray,
  deleteFromPinnedChats,
  setChatSelection,
  setPinnedChats,
} = chatSlice.actions;