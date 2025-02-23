import React, {
  Fragment,
  lazy,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useMyChatsQuery, useMyGroupsQuery } from "../../redux/reducers/api";
import { getSocket } from "../../socket";
import { motion } from "framer-motion";
import {
  InitialUsersStatus,
  MARK_MESSAGES_READ,
  NEW_GROUP_MESSAGE_ALERT,
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  ONLINE_USER,
  REFETECH_CHATS,
} from "../../constant/event";
import { useSocketEvents } from "../../hooks/hook";
import {
  closeChatList,
  setChatIdContextMenu,
  setGroupIdContextMenu,
  setIsChatList,
  setIsDeleteMenu,
  setIsGroupMenuOpen,
  setIsSideBarOpen,
} from "../../redux/reducers/misc";
import SearchInput from "../specific/InputField";
import ChatLoaders from "./Loaders";
import { setChatSelection, updateUnreadCount } from "../../redux/reducers/chat";
import Navbar from "./Navbar";
import { MenuIcon, Settings } from "lucide-react";
import { Button } from "../ui/button";
import Sidebar from "../specific/SideBar";
import CreateGroupDialog from "../Dialogs/CreateGroupDialog";
import GroupList from "../specific/groupList";
import { GroupContextMenu } from "../Dialogs/groupContextMenu";
import { setOnlineUsers } from "@/redux/reducers/auth";
const ChatList = lazy(() => import("../specific/ChatList"));
const DeleteChatMenu = lazy(() => import("../Dialogs/deleteChatMenu"));
const appLayout = () => (WrappedComponent) => {
  return (props) => {
    const { socket } = getSocket();
    const nav = useNavigate();
    const dispatch = useDispatch();
    const params = useParams();
    const chatId = params.chatId;
    const groupId = params.groupId;
    const chatListRef = useRef(null);
    const toggleButtonRef = useRef(null);
    const deleteOptionAnchor = useRef(null);

    const { data, isLoading, isError, error, refetch } = useMyChatsQuery();
    const {
      data: groupData,
      isLoading: myGroupsLoading,
      isError: LoadingGroupsError,
      error: GroupQueryError,
      refetch: refetchGroups,
    } = useMyGroupsQuery();
    const { user, onlineUsers } = useSelector((state) => state.auth);
    const { isChatList, isCreateGroup, isGroupMenuOpen, isDeleteMenu } =
      useSelector((state) => state.misc);
    console.log("online users update", onlineUsers);
    const OnlineListener = useCallback(
      ({ onlineUsersIds: users }) => {
        refetch();
        dispatch(setOnlineUsers(users));
        console.log("online users", users);
      },
      [refetch]
    );
    // console.log(groupData)
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
      (data) => {
        // console.log("new messag alert ")
        // console.log(data)
        dispatch(updateUnreadCount(data));
        refetch();
      },
      [refetch]
    );
    const newGroupMessageHandler = useCallback(
      (data) => {
        console.log("new grp messag alert ");
        console.log(data);
        dispatch(updateUnreadCount(data));
        refetch();
      },
      [refetch]
    );

    const OnlineStatusChangeListener = useCallback(
      ({ userId, status }) => {
        dispatch(updateUserStatus({ userId, status }));
        refetch();
      },
      [dispatch, refetch]
    );

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
      [NEW_GROUP_MESSAGE_ALERT]: newGroupMessageHandler,
      // [MARK_MESSAGES_READ]:markasread,
      [REFETECH_CHATS]: refetchChatHandler,
      [InitialUsersStatus]: OnlineListener,
      ["userStatusChange"]: OnlineStatusChangeListener,
    };
    useSocketEvents(socket, eventHandlers);

    const handleDeleteChat = (e, _id, chatRef, groupChat) => {
      e.preventDefault();
      console.log(_id, e, chatRef, groupChat, "herere");
      deleteOptionAnchor.current = e.currentTarget;
      deleteOptionAnchor.pageX = e.pageX;
      deleteOptionAnchor.pageY = e.pageY;
      if (groupChat) {
        dispatch(setGroupIdContextMenu(_id));
        return dispatch(setIsGroupMenuOpen(true));
      }
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
      <div className="h-screen w-100vw font-mono overflow-hidden">
        {/* header */}
        <Navbar />

        {isDeleteMenu && (
          <DeleteChatMenu socket={socket} anchor={deleteOptionAnchor} />
        )}
        {isGroupMenuOpen && (
          <GroupContextMenu socket={socket} anchor={deleteOptionAnchor} />
        )}
        {isCreateGroup && <CreateGroupDialog />}

        {/* togglechatlist */}
        <div className="md:hidden  shadow-2xl flex pl-4 h-[2rem] w-full">
          <button
            onClick={() => {
              dispatch(setIsChatList());
              dispatch(setChatSelection("all"));
            }}
          >
            <MenuIcon
              ref={toggleButtonRef}
              size={20}
              className="text-foreground"
            />
          </button>
        </div>

        {isChatList && (
          <motion.div
            ref={chatListRef}
            className="justify-between border border-border flex-col inset-x-1 z-30 shadow-2xl md:hidden fixed w-[75%] backdrop-blur-md h-[calc(100vh-6.5rem)] flex"
          >
            <div className="flex flex-col flex-grow overflow-hidden">
              <div className="px-5 mt-2 mb-2">
                <SearchInput />
              </div>
              {isLoading && myGroupsLoading ? (
                <ChatLoaders />
              ) : (
                <div className="bg-card flex-grow overflow-y-auto">
                  <ChatList
                    handleDeleteChat={handleDeleteChat}
                    onlineUsers={onlineUsers}
                    chatId={chatId}
                    chatData={data}
                    myGroups={groupData?.myGroups}
                    groupId={groupId}
                  />
                  {/* <GroupList
                  handleDeleteChat={handleDeleteChat}
                  groupId={groupId}
                  groupData={myGroups}
                /> */}
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
                {isLoading && myGroupsLoading ? (
                  <ChatLoaders />
                ) : (
                  <div className="h-full flex-shrink overflow-y-auto">
                    <ChatList
                      handleDeleteChat={handleDeleteChat}
                      onlineUsers={onlineUsers}
                      chatId={chatId}
                      chatData={data}
                      groupId={groupId}
                      myGroups={groupData?.myGroups}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Chat Page */}
            <div className="col-span-12 md:col-span-8 flex flex-col h-[calc(100vh-6.3rem)] md:h-[calc(100vh-6.4rem)] shadow-md">
              <WrappedComponent
                user={user}
                chatId={chatId}
                groupId={groupId}
                {...props}
              />
            </div>
          </div>
          <Button
            onClick={() => dispatch(setIsSideBarOpen(true))}
            className="inset-x-1 z-30 bg-transparent backdrop-blur-2xl hover:bg-card ml-2 h-10 w-10 sticky bottom-2 left-0 rounded-full p-1"
          >
            <Settings size={20} className="text-primary" />
          </Button>
          <Sidebar user={user} />
        </div>
      </div>
    );
  };
};

export default appLayout;
