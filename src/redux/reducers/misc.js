import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSearchOpen: false,
  isFileMenu: false,
  isDeleteMenu: false,
  uploadingLoader: false,
  selectedDeleteChat: {
    chatId: "",
    groupChat: false,
  },
  chatIdContextMenu:null,
  userTyping:false,
  ProfileMenu:false,
  isChatDetailsBarOpen:false
  ,isSideBarOpen:false
  ,isChatList:false
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsSearch: (state,action) => {
      state.isSearchOpen = action.payload
    },
    setIsChatDetailsBarOpen: (state) => {
      state.isChatDetailsBarOpen = !state.isChatDetailsBarOpen;
    },
    setIsFileMenu: (state) => {
      state.isFileMenu = !state.isFileMenu
    },
    setIsSideBarOpen: (state,action) => {
      state.isSideBarOpen = action.payload
    },
    setIsDeleteMenu: (state, action) => {
      state.isDeleteMenu = action.payload;
    },
    setUploadingLoader: (state, action) => {
      state.uploadingLoader = action.payload;
    },
    setSelectedDeleteChat: (state, action) => {
      state.selectedDeleteChat = action.payload;
    },
    setChatIdContextMenu:(state,action)=>{
      state.chatIdContextMenu = action.payload;
    },removeChatIdContextMenu:(state)=>{
        state.chatIdContextMenu=null
    },
    setUserTyping:(state,action)=>{
        state.userTyping=action.payload
    },
    setProfileMenu:(state)=>{
        state.ProfileMenu=!state
    },
    setIsChatList:(state)=>{
        state.isChatList=!state.isChatList
    },
    closeChatList:(state)=>{
        state.isChatList=false
    }
    
  },
});

export default miscSlice;
export const {setProfileMenu,
  setIsSideBarOpen,
  closeChatList,
  setIsChatDetailsBarOpen,
  setIsChatList,
setUserTyping,
  setIsSearch,
  setIsFileMenu,
  setIsDeleteMenu,
  setUploadingLoader,
  setSelectedDeleteChat,
  setIsProfile
  ,setChatIdContextMenu
  ,removeChatIdContextMenu
} = miscSlice.actions;