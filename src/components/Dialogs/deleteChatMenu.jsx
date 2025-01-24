

import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { setIsDeleteMenu } from '../../redux/reducers/misc';
import { useDeleteChatMutation } from '../../redux/reducers/api';
import { useNavigate } from 'react-router-dom';
import { deleteFromMuteChats, deleteFromPinnedChats, setMuteChats, setPinnedChats } from '../../redux/reducers/chat';
import { Bell, BellOffIcon, PinIcon, PinOffIcon, TrashIcon } from 'lucide-react';
import { FaVolumeMute } from 'react-icons/fa';

const DeleteChatMenu = ({anchor , socket}) => {

  const dispatch = useDispatch()
  const dialogRef = useRef(null)
  const nav = useNavigate()


  const [menuPosition, setMenuPosition] = useState(null);
  const {isDeleteMenu,chatIdContextMenu} = useSelector((state)=>state.misc)
  const {pinnedChats,muteChats} = useSelector((state)=>state.chat)
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
   // nav("/")
    console.log(res)
  }
  const pinChatHandler =()=>{
    dispatch(setIsDeleteMenu(false));
    socket.emit("pinChat",{pinned:true,userId:user.id,chatId:chatIdContextMenu})     
    dispatch(setPinnedChats(chatIdContextMenu))
}
const unPinChatHandler =()=>{
    dispatch(setIsDeleteMenu(false))
    socket.emit("pinChat",{pinned:false,userId:user.id,chatId:chatIdContextMenu})     
    dispatch(deleteFromPinnedChats(chatIdContextMenu))
}

  const muteChatHandler = ()=>{
    dispatch(setIsDeleteMenu(false));
    //socketLogic
    dispatch(setMuteChats(chatIdContextMenu))
  }
  const unMuteChatHandler = ()=>{
    dispatch(setIsDeleteMenu(false));
    //socketLogic
    dispatch(deleteFromMuteChats(chatIdContextMenu))
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
          className="bg-white shadow-lg rounded  z-50 text-gray-500"
        >
          <ul className='space-y-2 p-2'>
            {pinnedChats?.includes(chatIdContextMenu) ?
            <li onClick={unPinChatHandler}  className="px-4 border-separate border hover:bg-gray-200  cursor-pointer flex items-center justify-between"><PinOffIcon size={15}/> unfavourite</li> :
            <li onClick={pinChatHandler}  className="px-4  hover:bg-gray-200   flex items-center gap-1 cursor-pointer justify-between"><PinIcon size={15}/><span>favourite</span></li>
            }
            {
              muteChats?.includes(chatIdContextMenu) ?
              <li onClick={unMuteChatHandler}  className="px-4 hover:bg-gray-200  cursor-pointer gap-1 flex justify-between items-center"><Bell size={15}/> Un Mute</li>
              :
              <li onClick={muteChatHandler}  className="px-4 hover:bg-gray-200  cursor-pointer gap-2 flex justify-between items-center"><BellOffIcon size={15}/>Mute</li>
            
            }
            <li onClick={handleDeleteChat} className="px-4 hover:bg-gray-200   cursor-pointer gap-2 flex justify-between items-center"><TrashIcon size={15}/> Delete Chat </li>
          </ul>
        </div>
    </>
  
  )
}

export default DeleteChatMenu