import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import ChatList from '../specific/ChatList'
import Header from './Header'
import { useMyChatsQuery } from '../../redux/reducers/api'
import SearchInput from '../specific/InputField'
import {getSocket} from "../../socket"
import {I_AM_OFFLINE, I_AM_ONLINE, NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USER, REFETECH_CHATS } from "../../constant/event"
import { useSocketEvents } from '../../hooks/hook'
const appLayout = () =>(WrappedComponent)=> {
  return (props)=>{
    const {socket} = getSocket()
    console.log(socket)
    const dispatch = useDispatch()
    const params = useParams();
    const chatId = params.chatId;
    const [onlineUsers, setOnlineUsers] = useState(["hello"])
    //const onlineUsers = new Set()
    const {data,isLoading,isError,error,refetch} = useMyChatsQuery()
    const {user,Loader} = useSelector((state)=>state.auth) 
    
    const searchUser=()=>{
        e.preventDefault();
    }

    const OnlineListener = useCallback(({onlineUsers:users})=>{
        console.log("new user")
        setOnlineUsers(users)
        refetch()
    },[refetch])

    const refetchChatHandler = ()=>{
        refetch()
        console.log("Reftech")
  }

    // useEffect(() => {
    //     console.log("Current online users:", onlineUsers);
    //   }, [onlineUsers])
    const OnlineStatusChangeListener = useCallback(({userId})=>{
        console.log("status")
     
        setOnlineUsers(prev => {
            if ( prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            }
            return prev;
        });
        refetch()
        console.log("onlineuser",onlineUsers)
    },[])
    
    // console.log(onlineUsers,"onliine users")
    

     const eventHandlers = {
        //[NEW_MESSAGE_ALERT]:newMessageAlertHandler,
        // [NEW_MESSAGE]:newMessagesHandler,
        [REFETECH_CHATS]:refetchChatHandler,
        [ONLINE_USER]:OnlineListener,
        "userStatusChange":OnlineStatusChangeListener
      
      }
    useSocketEvents(socket,eventHandlers)

    return(
    <div className=' h-screen pb-0 m-0 grid grid-cols-12  ' >
        
<div className="shadow-2xl h-svh col-span-4 flex flex-col">
    {/* Search and Buttons */}
        <div className="bg-slate-200 w-full">
        <div className="px-4 pt-2">
            <SearchInput/>
        </div>
        <div className="overflow-x-scroll mb-2 bg-white scrollbar-none flex flex-row justify-start gap-4 pl-5 mt-6">
            <div className=''>
            <button
                className="  border border-slate-400 focus:border-red-500 text-slate-500 font-semibold text-xs rounded-full hover:bg-red-500 hover:text-white px-2 focus:outline-none focus:bg-red-500 focus:text-white active:bg-red-500 active:text-white transition duration-150 ease-in-out"
            >
                All
            </button>
            </div>
            <div>
            <button
                className="border border-slate-400 focus:border-red-500 text-slate-500 font-semibold text-xs rounded-full hover:bg-red-500 hover:text-white px-2 focus:outline-none focus:bg-red-500 focus:text-white active:bg-red-500 active:text-white transition duration-150 ease-in-out"
            >
                Recent
            </button>
            </div>
            <div>
            <button
                className="border border-slate-400 focus:border-red-500 text-slate-500 font-semibold text-xs rounded-full hover:bg-red-500 hover:text-white px-2 focus:outline-none focus:bg-red-500 focus:text-white active:bg-red-500 active:text-white transition duration-150 ease-in-out"
            >
                Favorites
            </button>
            </div>
            <div>
            <button
                className="border border-slate-400 focus:border-red-500 text-slate-500 font-semibold text-xs rounded-full hover:bg-red-500 hover:text-white px-2 focus:outline-none focus:bg-red-500 focus:text-white active:bg-red-500 active:text-white transition duration-150 ease-in-out"
            >
                Groups
            </button>
            </div>
        </div>
        </div>
        {/* Scrollable ChatList */}
      {
        isLoading ? <></> :
        
        <div className="shadow-xl mt-2 h-svh flex-grow overflow-y-auto scrollbar-none ">
        <ChatList onlineUsers={onlineUsers} chatId={chatId}  chatData={data} />
        </div>
       }
    </div>


  {/* Right Side - Chat Page */}
  <div className="ml-0.5 col-span-8 flex flex-col h-screen">
    
        <WrappedComponent user={user} chatId={chatId} {...props}/>
    
  </div>


    </div>
       
    )
  
}}

export default appLayout



