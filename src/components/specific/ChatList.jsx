import React, { useEffect, useState } from 'react'
import ChatItem from '../shared/chatItem'
import { useDispatch, useSelector } from 'react-redux'
import { setChatSelection } from '../../redux/reducers/chat'

const ChatList = ({
    chatData,
    chatId,
    onlineUsers,
    newMessagesAlert=[
        {chatId:"",
            count:0
        }],
        handleDeleteChat
}) => {
  console.log("chatList",chatData)
  //hooks
  const  dispatch = useDispatch()
  const {chatSelection,pinnedChats }= useSelector((state)=>state.chat)
 
  //states 
  const [chats, setChats] = useState([])

  // sort chat logic
  useEffect(() => {
    if (chatSelection === 'all' && chatData?.transformedChat) {
    allHandler()
    }
  }, [chatSelection,pinnedChats]);


      const allHandler = ()=>{
        const allChats = chatData.transformedChat;
        const pinnedChatsArray = allChats.filter((i) => pinnedChats.includes(i.chatId));
        const nonPinnedChatsArray = allChats.filter((i) => !pinnedChats.includes(i.chatId));

        setChats([...pinnedChatsArray, ...nonPinnedChatsArray]); // This will only setChats when chatData changes
      
      }
      const recentHandler = ()=>{
        dispatch(chatSelection("all"))
      }
      const favHandler = ()=>{
        dispatch(setChatSelection("Favorites"))
        const allChats = chatData.transformedChat;
        const favChats = allChats?.filter((i)=>pinnedChats?.includes(i.chatId))
        setChats(favChats)
      }


  //button hanlders
  const buttonHandlers = {"all":allHandler,"Recent":allHandler,"Favorites":favHandler}


  //console.log(Chats)
  return (
    <>
    <div className="pt-3  box-border  scrollbar-hide flex flex-row gap-4 pl-5 whitespace-nowrap">
          {['all', 'Recent', 'Favorites'].map((button) => (
            <button
              key={button}
              id={button}
              onClick={buttonHandlers[button]}
              className="border bg-[#FEF4F2] border-[#FCB4A5] text-[#DC4A2D] font-semibold text-xs rounded-full hover:bg-[#EF6144] hover:text-white px-2 focus:outline-none focus:bg-[#EF6144] focus:text-white active:bg-[#EF6144] active:text-white transition duration-150 ease-in-out"
            >
              {button}
            </button>
          ))}
        </div>
    <div className='w-full h-[calc(100%-2rem) flex  flex-col overflow-y-scroll scrollbar-hide justify-start gap-5'>
         {
          
          chats.length==0 ? 
            <div className='self-center justify-center pt-10 '>
               <div className='font-bold text-gray-400 text-lg h-full justify-center'>
                 {
                  chatSelection === "all" ? "No chats Search Users" :"No Chats Found"
                 }
               </div>
            </div>:
            chats.map((chat,index)=> {
              return <ChatItem
              handleDeleteChat={handleDeleteChat}
              selected={chatId===chat.chatId}
              lastMessage={chat?.chat?.lastMessage||""}
              lastSeen={chat?.chat?.lastSent}
              isOnline={onlineUsers?.includes(chat.user.id)} 
              index={index}
              key={index}
              avatar={chat?.user?.avatar} 
              name={chat?.user.name}
              _id={chat?.chatId}
              > </ChatItem>
            })
        }

    </div>
          </>
  )
}

export default ChatList
