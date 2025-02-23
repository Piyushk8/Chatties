

import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { setIsDeleteMenu, setIsGroupMenuOpen } from '../../redux/reducers/misc';
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/reducers/api';
import { useNavigate } from 'react-router-dom';
import { deleteFromMuteChats, deleteFromPinnedChats, setMuteChats, setPinnedChats } from '../../redux/reducers/chat';
import { Bell, BellOffIcon, PinIcon, PinOffIcon, TrashIcon } from 'lucide-react';
import { FaVolumeMute } from 'react-icons/fa';

export  const GroupContextMenu = ({anchor , socket}) => {

  const dispatch = useDispatch()
  const dialogRef = useRef(null)
  const nav = useNavigate()


  const [menuPosition, setMenuPosition] = useState(null);
  const {isGroupMenuOpen,groupIdContextMenu} = useSelector((state)=>state.misc)
  const {pinnedChats,muteChats} = useSelector((state)=>state.chat)
  const {user} = useSelector((state)=>state.auth)

  
  //hooks
//   const [deleteChat , {isError,isLoading,isSuccess}] = useDeleteChatMutation()
    const [exitGroup,{isError,isLoading,isSuccess}] = useLeaveGroupMutation()
  useEffect(()=>{
    dialogRef.current = anchor.current
  },[isGroupMenuOpen,groupIdContextMenu])
  console.log(groupIdContextMenu,"grp")

//   const handleDeleteGroup = async()=>{
//     const res = await deleteChat({id:chatId})
//    // nav("/")
//     console.log(res)
//   }
  const handleExitGroup = async()=>{
    const res = await exitGroup({id:groupIdContextMenu})
    if(res.data.success === true){
      nav("/")
    }
  }
  const pinChatHandler =()=>{
    dispatch(setIsDeleteMenu(false));
    socket.emit("pinChat",{isGroup:true, pinned:true,userId:user.id,groupId:groupIdContextMenu})     
    dispatch(setPinnedChats(groupIdContextMenu))
}
const unPinChatHandler =()=>{
    dispatch(setIsDeleteMenu(false))
    socket.emit("pinChat",{isGroup:true, pinned:false,userId:user.id,groupId:groupIdContextMenu})     
    dispatch(deleteFromPinnedChats(groupIdContextMenu))
}

  const muteChatHandler = ()=>{
    dispatch(setIsDeleteMenu(false));
    socket.emit("MUTECHAT",{isGroup:true, mute:true,userId:user.id,groupId:groupIdContextMenu}) 
    dispatch(setMuteChats(groupIdContextMenu))
  }
  const unMuteChatHandler = ()=>{
    dispatch(setIsDeleteMenu(false));
    socket.emit("MUTECHAT",{isGroup:true, mute:false,userId:user.id,groupId:groupIdContextMenu}) 
    dispatch(deleteFromMuteChats(groupIdContextMenu))
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        // Dispatch action to close the menu
        dispatch(setIsGroupMenuOpen(false));
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
          className="bg-card border-border border shadow-muted shadow-md rounded  z-50 text-primary"
        >
          <ul className='space-y-2 p-2'>
            {pinnedChats?.includes(groupIdContextMenu) ?
            <li onClick={unPinChatHandler}  className="px-4 border-separate border hover:bg-muted  cursor-pointer flex items-center justify-between"><PinOffIcon size={15}/>unpin</li> :
            <li onClick={pinChatHandler}  className="px-4  hover:bg-muted   flex items-center gap-1 cursor-pointer justify-between"><PinIcon size={15}/><span>pin group</span></li>
            }
            {
              muteChats?.includes(groupIdContextMenu) ?
              <li onClick={unMuteChatHandler}  className="px-4 hover:bg-muted  cursor-pointer gap-1 flex justify-between items-center"><Bell size={15}/>un-mute group</li>
              :
              <li onClick={muteChatHandler}  className="px-4 hover:bg-muted  cursor-pointer gap-2 flex justify-between items-center"><BellOffIcon size={15}/>mute group</li>
            
            }
            <li onClick={handleExitGroup} className="px-4 hover:bg-muted   cursor-pointer gap-2 flex justify-between items-center"><TrashIcon size={15}/>Exit group</li>
          </ul>
        </div>
    </>
  
  )
}
