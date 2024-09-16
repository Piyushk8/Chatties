

import React, { useReducer, useState } from 'react'
import { useSelector } from 'react-redux';

const DeleteChatMenu = () => {
  const [menuPosition, setMenuPosition] = useState(null);
  const {isDeleteMenu,chatIdContextMenu} = useSelector((state)=>state.misc)
  console.log(isDeleteMenu,chatIdContextMenu)
  const chatId = chatIdContextMenu
  // Handle right-click to open the context menu
  // const handleRightClick = (event) => {
  //   event.preventDefault(); // Prevent default context menu

  //   const rect = chatRef.current.getBoundingClientRect(); // Get position of the chat div

  //   setMenuPosition({
  //     top: rect.bottom, // Position it at the bottom of the chat div
  //     left: rect.left,  // Align it with the left side of the chat div
  //   });
  // };

  // Close the menu
  // const handleClose = () => {
  //   setMenuPosition(null);
  // };

  // Delete chat logic
  // const handleDeleteChat = () => {
  //   deleteChat(chat.id);
  //   handleClose();
  // };
  return (
    <>
    {
      !isDeleteMenu ? <>{chatIdContextMenu}</> : <div >
      menu
     </div>
 
    }
    </>
  
  )
}

export default DeleteChatMenu