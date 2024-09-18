import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ChatList from '../specific/ChatList'
import Header from './Header'
import { useMyChatsQuery } from '../../redux/reducers/api'
import SearchInput from '../specific/InputField'
import {getSocket} from "../../socket"
import {I_AM_OFFLINE, I_AM_ONLINE, NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USER, REFETECH_CHATS } from "../../constant/event"
import { useSocketEvents } from '../../hooks/hook'
import { closeChatList, setChatIdContextMenu, setIsChatList, setIsDeleteMenu } from '../../redux/reducers/misc'
import ChatLoaders from './Loaders'
import DeleteChatMenu from '../Dialogs/deleteChatMenu'
const appLayout = () =>(WrappedComponent)=> {
  return (props)=>{
    const {socket} = getSocket()
    //console.log(socket)
    const dispatch = useDispatch()
    const params = useParams();
    const chatId = params.chatId;
    const chatListRef = useRef(null)
    const toggleButtonRef = useRef(null)
    const deleteOptionAnchor = useRef(null)
    // window.addEventListener("click",(e)=>{
    //     if(e.target !== chatListRef.current && e.target !==toggleButtonRef ){
    //       dispatch(closeChatList())
    //     }
    //   })


    const [onlineUsers, setOnlineUsers] = useState(["hello"])
 
    const {data,isLoading,isError,error,refetch} = useMyChatsQuery()
    const {user,Loader} = useSelector((state)=>state.auth) 
    const {isChatList,isDeleteMenu} = useSelector((state)=>state.misc) 
    const {pinnedChats} = useSelector((state)=>state.chat) 
    console.log(pinnedChats)
    const searchUser=()=>{
        e.preventDefault();
    }

    const OnlineListener = useCallback(({onlineUsers:users})=>{
        setOnlineUsers(users)
        refetch()
    },[refetch])

    const refetchChatHandler = ({exists})=>{
        if(exists) return
       console.log("refteched on delete")
        refetch()

  }
    const newMessageAlertHandler = ({chatId})=>{
         console.log("alert")
        refetch()
  }

    const OnlineStatusChangeListener = useCallback(({userId})=>{
        setOnlineUsers(prev => {
            if ( prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            }
            return prev;
        });
        refetch()
        console.log("onlineuser",onlineUsers)
    },[])
    

     const eventHandlers = {
        [NEW_MESSAGE_ALERT]:newMessageAlertHandler,
        // [NEW_MESSAGE]:newMessagesHandler,
        [REFETECH_CHATS]:refetchChatHandler,
        [ONLINE_USER]:OnlineListener,
        "userStatusChange":OnlineStatusChangeListener
      
      }
    useSocketEvents(socket,eventHandlers)

    const handleDeleteChat = (e ,_id , chatRef,groupChat)=>{
      e.preventDefault()
      deleteOptionAnchor.current = e.currentTarget;
      deleteOptionAnchor.pageX = e.pageX;
      deleteOptionAnchor.pageY = e.pageY;

      dispatch(setChatIdContextMenu(_id))
       dispatch(setIsDeleteMenu(true))
    //   dispatch(setSelectedDeleteChat({chatId,_id,groupChat}))
    };

    return(
   <div className=' h-100hv w-100vw '>
    {/* header */}
        <div className='header flex justify-center items-center w-full bg-[#ffff] shadow-sm h-[4.3rem] md:h-[6.3rem]'>
            <div className='bg-slate-100  h-[60%] w-[95%] flex justify-between'>
                <div className='bg-slate-300 h-full w-20 p-4 flex justify-center items-center'><span>logo</span></div>
                <div className=' h-full w-20 p-4 flex justify-center items-center'><span>logo</span></div>
            </div>
        </div>
        
        
         {isDeleteMenu && <DeleteChatMenu socket={socket} anchor={deleteOptionAnchor}/>}
      
        {/* togglechatlist */}
        <div className='md:hidden flex pl-4 h-[2rem] w-full'>
            <button ref={toggleButtonRef} onClick={()=>dispatch(setIsChatList())}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
             </button>
             
            </div>
        {   
            isChatList && <div ref={chatListRef} className="md:hidden fixed inset-x-1  z-30 bg-white shadow-2xl  w-[80%] mt-2 backdrop-blur-md h-[calc(100vh-10rem)]  flex-grow overflow-y-auto scrollbar-track-[#E7E7E7] scrollbar  ">
             <div className="px-5 mt-2 border-gray-100   ">
                        <SearchInput/>
            </div>
      
            <div className='rounded-lg bg-slate-50 overflow-scroll'>
            <div className='pt-2 font-bold text-xl text-orange-600 text-center'>Your Chats</div>
            <ChatList handleDeleteChat={handleDeleteChat} onlineUsers={onlineUsers} chatId={chatId}  chatData={data} />
            </div>
            
            </div>
        }



    {/* MainArea */}
    <div className="w-full h-[calc(100vh-6.3rem)] md:h-[calc(100vh-6.4rem)]">
  <div className="md:h-full grid grid-cols-12">
    {/* Left side - Search, Buttons, and Chat List */}
    <div className="hidden overflow-hidden md:flex md:col-span-4 flex-col shadow-2xl">
      {/* Search and Buttons - Fixed */}
      <div className="flex-shrink-0">
        <div className="px-4 py-2 border-b-2 border-gray-100">
          <SearchInput />
        </div>
        <div className="pt-3  box-border overflow-x-auto flex flex-row gap-4 pl-5 whitespace-nowrap">
          {['All', 'Recent', 'Favorites'].map((button) => (
            <button
              key={button}
              className="border bg-[#FEF4F2] border-[#FCB4A5] text-[#DC4A2D] font-semibold text-xs rounded-full hover:bg-[#EF6144] hover:text-white px-2 focus:outline-none focus:bg-[#EF6144] focus:text-white active:bg-[#EF6144] active:text-white transition duration-150 ease-in-out"
            >
              {button}
            </button>
          ))}
        </div>
      </div>
      {/* Scrollable ChatList */}
      <div className="flex-grow overflow-hidden">
        {isLoading ? (
          <ChatLoaders />
        ) : (
          <div className="h-full flex-shrink overflow-y-auto">
            <ChatList handleDeleteChat={handleDeleteChat} onlineUsers={onlineUsers} chatId={chatId} chatData={data} />
          </div>
        )}
      </div>
    </div>

    {/* Right Side - Chat Page */}
    <div className="col-span-12 md:col-span-8 flex flex-col h-[calc(100vh-6.3rem)] md:h-[calc(100vh-6.4rem)]">
      <WrappedComponent user={user} chatId={chatId} {...props} />
    </div>
  </div>
</div>
       </div>
    )
  
}}

export default appLayout


