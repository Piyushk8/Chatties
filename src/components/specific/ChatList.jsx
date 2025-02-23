import React, { Fragment, useEffect, useState } from "react";
import ChatItem from "../shared/chatItem";
import { useDispatch, useSelector } from "react-redux";
import { setChatSelection, setUnreadChats } from "../../redux/reducers/chat";
import GroupItem from "../shared/groupItem";
import { MARK_MESSAGES_READ } from "@/constant/event";

const ChatList = React.memo(({
  myGroups,
  groupId,
  chatData,
  chatId,
  onlineUsers,
  handleDeleteChat,
}) => {
  //hooks
  const dispatch = useDispatch();
  const [chats, setChats] = useState([]);
  const { chatSelection, pinnedChats, unreadChats } = useSelector(
    (state) => state.chat
  );
  useEffect(() => {
    const transformedChats = Array.isArray(chatData?.transformedChat) ? chatData.transformedChat : [];
    const transformedGroups = Array.isArray(myGroups) ? myGroups : [];
    
    dispatch(setUnreadChats([...transformedChats, ...transformedGroups]));
  }, [chatData, myGroups]);
  
  // sort chat logic
  useEffect(() => {
    if (chatSelection === "all" && chatData?.transformedChat) {
      allHandler();
    }
  }, [chatSelection, pinnedChats, chatData]);

  const allHandler = () => {
    dispatch(setChatSelection("all"));

    const allChats = chatData?.transformedChat || [];
    const allGroups = myGroups || [];

    // Separate pinned and non-pinned chats
    const pinnedChatsArray = allChats.filter((c) =>
      pinnedChats.includes(c.chat.id)
    );
    const nonPinnedChatsArray = allChats.filter(
      (c) => !pinnedChats.includes(c.chat.id)
    );

    // Separate pinned and non-pinned groups
    const pinnedGroupsArray = allGroups.filter((g) =>
      pinnedChats.includes(g.group.id)
    );
    const nonPinnedGroupsArray = allGroups.filter(
      (g) => !pinnedChats.includes(g.group.id)
    );

    // Sort chats and groups with pinned items first
    setChats([
      ...pinnedChatsArray,
      ...pinnedGroupsArray,
      ...nonPinnedChatsArray,
      ...nonPinnedGroupsArray,
    ]);
  };

  const recentHandler = () => {
    dispatch(setChatSelection("recent"));

    const unreadChats =
      chatData?.transformedChat?.filter((c) => isUnreadChat(c?.chat?.id)) || [];
    const unreadGroups =
      myGroups?.filter((g) => isUnreadChat(g?.group?.id)) || [];

    setChats([...unreadChats, ...unreadGroups]);
  };

  const favHandler = () => {
    dispatch(setChatSelection("Favorites"));

    const favChats =
      chatData?.transformedChat?.filter(({ chat }) =>
        pinnedChats?.includes(chat.id)
      ) || [];
    const favGroups =
      myGroups?.filter(({ group }) => pinnedChats?.includes(group.id)) || [];

    setChats([...favChats, ...favGroups]);
  };

  const groupHandler = () => {
    dispatch(setChatSelection("Groups"));
    const pinnedGroupsArray =
      myGroups?.filter((g) => pinnedChats?.includes(g?.group?.id)) || [];
    const nonPinnedGroupsArray =
      myGroups?.filter((g) => !pinnedChats?.includes(g?.group?.id)) || [];
    setChats([...pinnedGroupsArray, ...nonPinnedGroupsArray]);
  };

  const isUnreadChat = (id) => {
    return unreadChats?.some((c) => c.chatId === id);
  };

  const getUnreadChatCount = (id) => {
    const chat = unreadChats?.find((c) => c?.id === id );
    return chat?.count === 0 ? "" : chat?.count;
  };
  //button hanlders
  const buttonHandlers = {
    all: allHandler,
    groups: groupHandler,
    Recent: recentHandler,
    Favorites: favHandler,
  };

  return (
    <>
      <div className="w-full h-[calc(100%-2rem)] flex flex-col overflow-hidden scrollbar-hide justify-start">
        {/* Selection Buttons */}
        <div className="py-3 font-mono border overflow-x-auto border-separate scrollbar-hide flex flex-row gap-4 pl-5 whitespace-nowrap">
          {["all", "Recent", "Favorites", "groups"].map((button) => (
            <button
              key={button}
              id={button}
              onClick={buttonHandlers[button]}
              className="border bg-card border-secondary-foreground 
                 hover:bg-primary hover:border-primary-foreground 
                 p-0.5 font-semibold text-xs rounded-full 
                 hover:text-secondary px-2 
                 focus:outline-none focus:text-white 
                 active:bg-primary active:text-black 
                 transition duration-150 ease-in-out"
            >
              {button}
            </button>
          ))}
        </div>

        {/* Display Chat Items */}
        <div className="overflow-y-auto w-full flex flex-col overflow-hidden scrollbar-hide justify-start">
        {chats.length === 0 ? (
          <div className="text-primary text-2xl text-center">
            No chats found
          </div>
        ) : (
          chats.map(({ chat, user, group }, index) => {
            return chat ? (
              <ChatItem
                key={index}
                handleDeleteChat={handleDeleteChat}
                selected={chatId === chat?.id}
                lastMessage={chat?.lastMessage || ""}
                lastSeen={chat?.lastSent}
                isOnline={onlineUsers?.includes(user?.id)}
                unreadCount={getUnreadChatCount(chat?.id)}
                avatar={user?.avatar}
                name={user?.name}
                _id={chat?.id}
              />
            ) : (
              <GroupItem
              unreadCount={getUnreadChatCount(group?.id)}
                key={index}
                groupName={group?.groupname}
                id={group?.id}
                selected={group?.id === groupId}
                lastMessage={group?.lastMessage}
                handleDeleteChat={handleDeleteChat}
                groupImage={group?.groupImage}
              />
            );
          })
        )}
        </div>
      </div>
    </>
  );
});

export default ChatList;
