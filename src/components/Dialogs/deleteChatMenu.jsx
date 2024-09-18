

import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { setIsDeleteMenu } from '../../redux/reducers/misc';
import { useDeleteChatMutation } from '../../redux/reducers/api';
import { useNavigate } from 'react-router-dom';
import { deleteFromPinnedChats, setPinnedChats } from '../../redux/reducers/chat';

const DeleteChatMenu = ({anchor , socket}) => {

  const dispatch = useDispatch()
  const dialogRef = useRef(null)
  const nav = useNavigate()


  const [menuPosition, setMenuPosition] = useState(null);
  const {isDeleteMenu,chatIdContextMenu} = useSelector((state)=>state.misc)
  const {pinnedChats} = useSelector((state)=>state.chat)
  const {user} = useSelector((state)=>state.auth)
  console.log(isDeleteMenu,chatIdContextMenu,anchor)
  
  const chatId = chatIdContextMenu

  //hooks
  const [deleteChat , {isError,isLoading,isSuccess}] = useDeleteChatMutation()

  useEffect(()=>{
    dialogRef.current = anchor.current
  },[isDeleteMenu,chatIdContextMenu])

  const handleDeleteChat = async()=>{
    const res = await deleteChat({id:chatId})
    nav("/")
    console.log(res)
  }
  const pinChatHandler =()=>{
    dispatch(setIsDeleteMenu(false));
    console.log("pinchat",user)
    socket.emit("pinChat",{pinned:true,userId:user.id,chatId:chatIdContextMenu})     
    dispatch(setPinnedChats(chatIdContextMenu))
    console.log(pinnedChats)
}
const unPinChatHandler =()=>{
    dispatch(setIsDeleteMenu(false))
    socket.emit("pinChat",{pinned:false,userId:user.id,chatId:chatIdContextMenu})     
    dispatch(deleteFromPinnedChats(chatIdContextMenu))
    console.log(pinnedChats)
}


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        // Dispatch action to close the menu
        dispatch(setIsDeleteMenu(false));
      }
    };
    // Attach the event listener
    window.addEventListener('click', handleClickOutside);

    // Clean up the event listener when the component is unmounted or dialog is closed
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [dispatch])
  return (
    <>
    <div
         ref={dialogRef}
          
          style={{
            position: 'fixed',
            left: `${anchor.pageX}px`,
            top: `${anchor.pageY}px`,
            //transform: 'translate(-50%, -50%)', // Optional for centering
          }}
          className="bg-white shadow-lg rounded p-4 z-50"
        >
          <ul>
            {pinnedChats?.includes(chatIdContextMenu) ?
            <li onClick={unPinChatHandler}  className="hover:bg-gray-200 p-2 cursor-pointer">unfavourite</li> :
            <li onClick={pinChatHandler}  className="hover:bg-gray-200 p-2 cursor-pointer">favourite</li>
            }
            <li className="hover:bg-gray-200 p-2 cursor-pointer">Mute Chat </li>
            <li onClick={handleDeleteChat} className="hover:bg-gray-200 p-2 cursor-pointer">Delete Chat </li>
          </ul>
        </div>
    </>
  
  )
}

export default DeleteChatMenu