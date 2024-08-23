import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSearch: false,
  isFileMenu: false,
  isDeleteMenu: false,
  uploadingLoader: false,
  selectedDeleteChat: {
    chatId: "",
    groupChat: false,
  },
  chatIdContextMenu:null,
  userTyping:false,
  ProfileMenu:false
};

const miscSlice = createSlice({
  name: "misc",
  initialState,
  reducers: {
    setIsSearch: (state, action) => {
      state.isSearch = action.payload;
    },
    setIsFileMenu: (state) => {
      state.isFileMenu = !state.isFileMenu
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
        state.userTyping=!state
    }
    
  },
});

export default miscSlice;
export const {setProfileMenu,
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