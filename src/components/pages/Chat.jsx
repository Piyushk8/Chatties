import React, { lazy, useCallback, useEffect, useRef, useState } from 'react'
import appLayout from '../Layout/appLayout'
import { useParams } from 'react-router-dom'
import { useChatDetailsQuery, useGetMessagesQuery } from '../../redux/reducers/api'
import MessageComponent from '../shared/messageComponent'
import { useInfiniteScrollTop } from '../../hooks/hook'
import {ALERT,NEW_MESSAGE,NEW_MESSAGE_ALERT,IS_TYPING,STOP_TYPING} from "../../constant/event"
import { useSocketEvents } from "../../hooks/hook"
import {getSocket} from "../../socket"
import { useDispatch, useSelector } from 'react-redux'
import { setIsFileMenu, setUserTyping } from '../../redux/reducers/misc'
import Header from '../Layout/Header'
const FileMenu = lazy(()=>import('../specific/FileMenu'))
const Chat = ({chatId,user}) => {
  const {socket} = getSocket()
  const dispatch = useDispatch();

  const [page, setpage] = useState(1)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [MeTyping, setMeTyping] = useState(false)
  
  const typingtimeOut = useRef(null)
  const containerRef = useRef(null)
  const fileMenuRef = useRef(null)
  const bottomRef = useRef(null)
  
  const {userTyping ,isFileMenu} = useSelector((state)=>state.misc)
  
  const {data,isLoading
    ,isError,error
  } = useGetMessagesQuery({
    page,id:chatId
  }) 

  const {data:chatDetails,
    isError:chatDetailsIsError,
    isLoading:chatDetailsLoading
  } = useChatDetailsQuery({id:chatId})
  const members =chatDetails?.members
  
  const {
    data:oldMessages,setData:setOldMessages
  } = useInfiniteScrollTop(
    containerRef,
    data?.totalMessages,page,
    setpage,
    data?.messages
  )


//!all handlers
const SubmitHandler = (e)=>{
  e.preventDefault();
  if(!message.trim()) return;
   //to emit message to server
 
  socket.emit(NEW_MESSAGE,{chatId , members ,message})
  setMessage("")
  }
  const MessageOnChange =(e)=>{
    e.preventDefault();
    setMessage(e.target.value);
    
    if(!MeTyping){
        socket.emit(IS_TYPING,{members,chatId})
        setMeTyping(true)
      }
      if(typingtimeOut) clearTimeout(typingtimeOut.current)
      typingtimeOut.current = setTimeout(() => {
          socket.emit(STOP_TYPING,{members,chatId})
          setMeTyping(false)
        }, 1500);
        
      }
      const openFileMenu =(e)=>{
        fileMenuRef.pageX = e.pageX,
        fileMenuRef.pageY = e.pageY
        dispatch(setIsFileMenu())
      }
    
      
      //!Event listner handlers
      const isTypingListener = useCallback((data) => {
        if (data.chatId !== chatId) return;
       // setUsertyping(true)
        dispatch(setUserTyping(true))
      }, [chatId]);
      
      
      const stopTypingListener = useCallback((data) => {
        if (data.chatId !== chatId) return;
        // setUsertyping(false)
        dispatch(setUserTyping(false))
      }, [chatId]);
      
      
      const newMessagesListener = useCallback((data) => {
        console.log(data,"data")
        if (data.chatId !== chatId) return;
        console.log("newmesageListener")
        // Safely update messages state
        setMessages((prevMessages) => [...prevMessages, data.message]);
      }, [chatId]);
      
      const AlertListener = useCallback((content) => {
        if (data.chatId !== chatId) return;
        const messageForAlert = {
          content,
          sender:{
            _id:"csefwfkjfnksfnkwfks",
            name:"Admin"
          },
          chat:chatId ,
          createdAt:new Date().toISOString(),
        }
      }, [chatId]);
      
      
      const eventHandlers = {
        [ALERT] : AlertListener,
        [NEW_MESSAGE]:newMessagesListener,
        [IS_TYPING]:isTypingListener,
        [STOP_TYPING]:stopTypingListener
      }
      useSocketEvents(socket,eventHandlers)
      

      useEffect(()=>{
        // socket.emit(CHAT_JOINED,{userId:user._id,members})
         //dispatch(removeNewMessagesAlert(chatId))
       
         return()=>{
           setMessages([]);
           setMessage("");
           setOldMessages([]);
           setpage(1);
           // socket.emit(CHAT_LEFT,{userId:user._id,members})
         }
       },[chatId])
      
      useEffect(()=>{
        if(bottomRef.current) bottomRef.current.scrollIntoView({behavior:"smooth"})
        },[messages])
      // console.log(messages)
      
      return (<>
    {
      isLoading ? <></> :
      <div className='h-full w-full'> 
          {!chatDetailsLoading && <Header user={chatDetails?.members[0]?.user} /> } 
        
        <div  className='flex flex-col justify-between border-box  flex-1 h-[calc(100%-4rem)]'> 
  {/* chat area */}
    

        <div ref={containerRef} className='overflow-y-scroll flex flex-col scrollbar-thin scrollbar-thumb-orange-400 pl-1 pr-2 md:pr-8'>
        {
          oldMessages?.map((message,index)=>{
            return <MessageComponent key={index} user={user} message={message}/>
          })
          
        }
        {
          messages?.map((message,index)=>{
            return <MessageComponent key={index} user={user} message={message} ></MessageComponent>
          })
        }
        <div ref={bottomRef}> </div>
                {isFileMenu && <FileMenu chatId={chatId} fileMenuRef={fileMenuRef} />}
        </div>

  {/* send message area */}
        <div className=' w-full '>
          <form onSubmit={SubmitHandler} className='flex flex-col justify-center h-full w-full'>
          <div className='flex gap-1 py-5 px-6 relative items-center justify-around w-full '>
              
  
              <div className='bg-[#F6F6F6] p-1 flex gap-1 w-full items-center relative' ref={fileMenuRef}>
                <input type="text"
                placeholder='send...' 
                className='border-none bg-slate-100 rounded-xl  h-10 w-[90%]'
                onChange={MessageOnChange}
                value={message}
                
                />
                <div className='mr-1' ref={fileMenuRef} onClick={openFileMenu}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#EF6144" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round"  
                    d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                  </svg>
                  </div>
              <div onClick={SubmitHandler} className='bg-[#FEE7E2] p-1' >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#DC4A2D" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
              </svg>

              </div>
              </div>

            </div>
          
          </form>
        </div>
      </div>
     

    
    </div>
    }
    </>
  )
}

export default appLayout()(Chat);
