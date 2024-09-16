import React from 'react'
import ChatItem from '../shared/chatItem'

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
 
  const Chats =chatData?.transformedChat
  //console.log(Chats)
  return (
    <div className='w-full h-[calc(100%-2rem)] flex flex-col overflow-y-scroll scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-corner-white justify-start gap-5'>
         {
          Chats.map((chat,index)=> {
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
  )
}

export default ChatList
