import React, { useEffect, useReducer, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setIsDeleteMenu } from "../../redux/reducers/misc";
import { useDeleteChatMutation } from "../../redux/reducers/api";
import { useNavigate } from "react-router-dom";
import {
  deleteFromMuteChats,
  deleteFromPinnedChats,
  setMuteChats,
  setPinnedChats,
} from "../../redux/reducers/chat";
import {
  Bell,
  BellOffIcon,
  PinIcon,
  PinOffIcon,
  TrashIcon,
} from "lucide-react";
import { FaVolumeMute } from "react-icons/fa";

const DeleteChatMenu = ({ anchor, socket }) => {
  const dispatch = useDispatch();
  const dialogRef = useRef(null);
  const nav = useNavigate();

  const [menuPosition, setMenuPosition] = useState(null);
  const { isDeleteMenu, chatIdContextMenu } = useSelector(
    (state) => state.misc
  );
  const { pinnedChats, muteChats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const chatId = chatIdContextMenu;

  //hooks
  const [deleteChat, { isError, isLoading, isSuccess }] =
    useDeleteChatMutation();

  useEffect(() => {
    dialogRef.current = anchor.current;
  }, [isDeleteMenu, chatIdContextMenu]);

  const handleDeleteChat = async () => {
    const res = await deleteChat({ id: chatId });
  };
  const pinChatHandler = () => {
    dispatch(setIsDeleteMenu(false));
    socket.emit("pinChat", {
      pinned: true,
      isGroup: false,
      userId: user.id,
      chatId: chatIdContextMenu,
    });
    dispatch(setPinnedChats(chatIdContextMenu));
  };
  const unPinChatHandler = () => {
    dispatch(setIsDeleteMenu(false));
    socket.emit("pinChat", {
      pinned: false,
      isGroup: false,
      userId: user.id,
      chatId: chatIdContextMenu,
    });
    dispatch(deleteFromPinnedChats(chatIdContextMenu));
  };

  const muteChatHandler = () => {
    dispatch(setIsDeleteMenu(false));
    socket.emit("MUTECHAT", {
      mute: true,
      isGroup: false,
      userId: user.id,
      chatId: chatIdContextMenu,
    });
    dispatch(setMuteChats(chatIdContextMenu));
  };
  const unMuteChatHandler = () => {
    dispatch(setIsDeleteMenu(false));
    socket.emit("MUTECHAT", {
      mute: false,
      isGroup: false,
      userId: user.id,
      chatId: chatIdContextMenu,
    });
    dispatch(deleteFromMuteChats(chatIdContextMenu));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        // Dispatch action to close the menu
        dispatch(setIsDeleteMenu(false));
      }
    };
    // Attach the event listener
    window.addEventListener("click", handleClickOutside);

    // Clean up the event listener when the component is unmounted or dialog is closed
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [dispatch]);
  return (
    <>
      <div
        ref={dialogRef}
        style={{
          position: "fixed",
          left: `${Math.min(anchor.pageX, window.innerWidth - 200)}px`,
          top: `${Math.min(anchor.pageY, window.innerHeight - 150)}px`,
        }}
        className="bg-card shadow-lg rounded-lg z-50 text-card-foreground  border border-border "
      >
        <ul className="space-y-1 p-2 w-48">
          {pinnedChats?.includes(chatIdContextMenu) ? (
            <li
              onClick={unPinChatHandler}
              className="px-4 py-2 hover:bg-muted border-b-2 border-border cursor-pointer flex items-center gap-2"
            >
              <PinOffIcon size={15} /> <span>unpin</span>
            </li>
          ) : (
            <li
              onClick={pinChatHandler}
              className="px-4 py-2 hover:bg-muted border-b-2 border-border  cursor-pointer flex items-center gap-2"
            >
              <PinIcon size={15} /> <span>Pin</span>
            </li>
          )}
          {muteChats?.includes(chatIdContextMenu) ? (
            <li
              onClick={unMuteChatHandler}
              className="px-4 py-2 hover:bg-muted border-b-2 border-border  cursor-pointer flex items-center gap-2"
            >
              <Bell size={15} /> <span>Unmute</span>
            </li>
          ) : (
            <li
              onClick={muteChatHandler}
              className="px-4 py-2 hover:bg-muted border-b-2 border-border cursor-pointer flex items-center gap-2"
            >
              <BellOffIcon size={15} /> <span>Mute</span>
            </li>
          )}
          <li
            onClick={handleDeleteChat}
            className="px-4 py-2 hover:bg-muted  text-red-500 cursor-pointer flex items-center gap-2"
          >
            <TrashIcon size={15} /> <span>Delete Chat</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default DeleteChatMenu;
