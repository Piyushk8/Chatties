import React, { Fragment, lazy, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useMyChatsQuery } from "../../redux/reducers/api";
import { getSocket } from "../../socket";
import { motion } from "framer-motion"
import {
  InitialUsersStatus,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USER,
  REFETECH_CHATS,
} from "../../constant/event";
import { useSocketEvents } from "../../hooks/hook";
import {
  closeChatList,
  setChatIdContextMenu,
  setIsChatList,
  setIsDeleteMenu,
  setIsSideBarOpen,
} from "../../redux/reducers/misc";
import SearchInput from "../specific/InputField";
import ChatLoaders from "./Loaders";
import { setChatSelection } from "../../redux/reducers/chat";
import Navbar from "./Navbar";
import { MenuIcon, Settings } from "lucide-react";
import { Button } from "../ui/button";
import Sidebar from "../specific/SideBar";
const ChatList = lazy(() => import("../specific/ChatList"));
const DeleteChatMenu = lazy(() => import("../Dialogs/deleteChatMenu"));
const appLayout = () => (WrappedComponent) => {
  return (props) => {
    const { socket } = getSocket();
    //console.log(socket)
    const nav = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const chatId = params.chatId;
    const chatListRef = useRef(null);
    const toggleButtonRef = useRef(null);
    const deleteOptionAnchor = useRef(null);

    const { data, isLoading, isError, error, refetch } = useMyChatsQuery();
    const { user } = useSelector((state) => state.auth);
    const { isChatList, isDeleteMenu ,isSideBarOpen} = useSelector((state) => state.misc);
    // const {pinnedChats} = useSelector((state)=>state.chat)
console.log(isSideBarOpen)
    const OnlineListener = useCallback(
      ({ onlineUsersIds: users }) => {
        setOnlineUsers(users);
        refetch();
        console.log(onlineUsers);
      },
      [refetch]
    );

    const refetchChatHandler = useCallback(
      (data) => {
        refetch()
          .then(() => {
            // After refetching, navigate to the home page
            // if(data===false || data ==="delete"){
            //  nav('/');}
          })
          .catch((err) => {
            console.error("Error while refetching chats:", err);
          });
      },
      [refetch]
    );
    const newMessageAlertHandler = useCallback(
      ({ chatId }) => {
        refetch();
      },
      [refetch]
    );

    const [onlineUsers, setOnlineUsers] = useState([]);

    const OnlineStatusChangeListener = useCallback(({ userId, status }) => {
      if (status === "offline") {
        setOnlineUsers((prev) => {
          if (!prev || prev.length === 0) return []; // Handle undefined or empty array
          if (prev.includes(userId)) {
            return prev.filter((id) => id !== userId);
          }
          return prev;
        });
      } else {
        setOnlineUsers((prev) => {
          if (!prev) return [userId]; // Handle undefined initial state
          if (!prev.includes(userId)) {
            return [...prev, userId];
          }
          return prev;
        });
      }

      refetch(); // Ensure refetch is still called
    }, []);

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
      // [NEW_MESSAGE]:newMessagesHandler,
      [REFETECH_CHATS]: refetchChatHandler,
      [InitialUsersStatus]: OnlineListener,
      ["userStatusChange"]: OnlineStatusChangeListener,
    };
    useSocketEvents(socket, eventHandlers);

    const handleDeleteChat = (e, _id, chatRef, groupChat) => {
      e.preventDefault();
      deleteOptionAnchor.current = e.currentTarget;
      deleteOptionAnchor.pageX = e.pageX;
      deleteOptionAnchor.pageY = e.pageY;
      dispatch(setChatIdContextMenu(_id));
      dispatch(setIsDeleteMenu(true));
      //   dispatch(setSelectedDeleteChat({chatId,_id,groupChat}))
    };

    useEffect(() => {
      const handleClickOutside = (e) => {
        if (
          chatListRef.current &&
          !chatListRef.current.contains(e.target) &&
          toggleButtonRef.current &&
          !toggleButtonRef.current.contains(e.target)
        ) {
          dispatch(closeChatList());
          dispatch(setChatSelection("all"));
        }
      };

      if (isChatList) {
        window.addEventListener("click", handleClickOutside);
      }
      return () => {

        window.removeEventListener("click", handleClickOutside);
      };
    }, [isChatList]);

    return (
      <div className="bg-background h-screen w-100vw font-mono overflow-hidden">
      {/* header */}
      <Navbar />
    
      {isDeleteMenu && (
        <DeleteChatMenu socket={socket} anchor={deleteOptionAnchor} />
      )}
    
      {/* togglechatlist */}
      <div className="md:hidden shadow-2xl flex pl-4 h-[2rem] w-full">
        <button
          onClick={() => {
            dispatch(setIsChatList());
            dispatch(setChatSelection("all"));
          }}
        >
          <MenuIcon ref={toggleButtonRef} size={20} className="text-foreground" />
        </button>
      </div>
    
      {isChatList && (
        <motion.div
          ref={chatListRef}
          className="justify-between border border-border flex-col shadow-2xl md:hidden fixed inset-x-1 z-30 w-[75%] backdrop-blur-md h-[calc(100vh-6.5rem)] flex"
        >
          <div className="flex flex-col flex-grow overflow-hidden">
            <div className="px-5 mt-2 mb-2">
              <SearchInput />
            </div>
            {isLoading ? (
              <ChatLoaders />
            ) : (
              <div className="bg-card flex-shrink overflow-y-auto">
                <ChatList
                  handleDeleteChat={handleDeleteChat}
                  onlineUsers={onlineUsers}
                  chatId={chatId}
                  chatData={data}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    
      {/* MainArea */}
      <div className="bg-background w-full h-[calc(100vh-7rem)] md:h-[calc(100vh-7rem)]">
        <div className="md:h-full grid grid-cols-12">
          {/* Left side - Search, Buttons, and Chat List */}
          <div className="hidden bg-card overflow-hidden md:flex md:col-span-4 flex-col shadow-lg border-r border-primary-foreground">
            {/* Search and Buttons - Fixed */}
            <div className="flex-shrink-0 border border-separate">
              <div className="px-4 py-2 ">
                <SearchInput />
              </div>
            </div>
            {/* Scrollable ChatList */}
            <div className="flex-grow overflow-hidden">
              {isLoading ? (
                <ChatLoaders />
              ) : (
                <div className="h-full flex-shrink overflow-y-auto">
                  <ChatList
                    handleDeleteChat={handleDeleteChat}
                    onlineUsers={onlineUsers}
                    chatId={chatId}
                    chatData={data}
                  />
                </div>
              )}
            </div>
          </div>
    
          {/* Right Side - Chat Page */}
          <div className="col-span-12 md:col-span-8 flex flex-col h-[calc(100vh-6.3rem)] md:h-[calc(100vh-6.4rem)] shadow-md">
            <WrappedComponent user={user} chatId={chatId} {...props} />
          </div>
        </div>
        <Button onClick={()=>dispatch(setIsSideBarOpen(true))} className="bg-secondary hover:bg-card ml-2 h-10 w-10 sticky bottom-2 left-0 rounded-full p-1">
          <Settings size={20} className="text-primary" />
        </Button>
        <Sidebar user={user}/>
      </div>
    </div>
    
    );
  };
};

export default appLayout;
