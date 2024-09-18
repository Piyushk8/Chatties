import React from 'react'
import ChatItem from '../shared/chatItem'
import { useSelector } from 'react-redux'

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
 
  const chats =chatData?.transformedChat


  let sortedChats = chats
   //to sort the chats when pinned
   const {pinnedChats }= useSelector((state)=>state.chat)
    if(chats){
      //console.log(chats)
      const pinchat = chats?.filter((i)=>pinnedChats.includes(i.chatId))
      const nonPinchat = chats?.filter((i)=>!pinnedChats.includes(i.chatId))
      console.log(pinchat,nonPinchat)
    sortedChats = [...pinchat,...nonPinchat]
    }

  //console.log(Chats)
  return (
    <div className='w-full h-[calc(100%-2rem)] flex flex-col overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-corner-white justify-start gap-5'>
         {
          sortedChats.map((chat,index)=> {
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
{/* <div
         ref={dialogRef}
          
          style={{
            position: 'fixed',
            left: `${dialogRef.pageX}`,
            top: `${dialogRef.pageY}`,
            //transform: 'translate(-50%, -50%)', // Optional for centering
          }}
          className="bg-white shadow-lg rounded p-4 z-50"
        >
          <ul>
            <li className="hover:bg-gray-200 p-2 cursor-pointer">Pin Chat </li>
            <li className="hover:bg-gray-200 p-2 cursor-pointer">Mute Chat </li>
            <li className="hover:bg-gray-200 p-2 cursor-pointer">Delete Chat </li>
          </ul>
        </div> */}
    </div>
  )
}

export default ChatList
