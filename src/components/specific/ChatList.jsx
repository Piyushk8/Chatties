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
  console.log(onlineUsers)
  const Chats =chatData?.transformedChat
  return (
    <div className='w-full h-full flex flex-col justify-start gap-5'>
        {
          Chats.map((chat,index)=> {
            return <ChatItem
            selected={chatId===chat.chatId}
            lastMessage={chat?.chat?.lastMessage||""}
            lastseen={chat?.chat?.lastsent}
            isOnline={onlineUsers.includes(chat.user.id)} 
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
