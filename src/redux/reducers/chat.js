import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  //notificationCount: 0,
  unreadChats:[{
    chatId:"",count:0
  }],
  pinnedChats:[],
  muteChats:[]
  ,chatSelection:"all"
 
  
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setUnreadChats: (state, action) => {
      state.unreadChats = action.payload?.filter(chatMember => chatMember.unreadCount > 0)
        ?.map(chatMember => ({
          chatId: chatMember.chat.id,
          count: chatMember.unreadCount
        }));
    },
    updateUnreadCount:(state,{payload})=>{
      const updatedchats = state?.unreadChats.filter((c)=>c.chatId!==payload?.chatId)
      state.unreadChats=[{chatId:payload?.chatId,count:payload?.unreadCount},...updatedchats]
    },
    removeUnreadChat:(state,{payload})=>{
      const updatedchats = state?.unreadChats.filter((c)=>c.chatId!==payload)
      state.unreadChats=[{chatId:payload,count:0},...updatedchats]
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