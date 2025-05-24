import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDeleteChatMutation } from "../../redux/reducers/api";
import { useNavigate } from "react-router-dom";
import {
  deleteFromMuteChats,
  deleteFromPinnedChats,
  setMuteChats,
  setPinnedChats,
} from "../../redux/reducers/chat";
import { Bell, BellOffIcon, PinIcon, PinOffIcon, TrashIcon } from "lucide-react";
import { setIsDeleteMenu } from "@/redux/reducers/misc";

const DeleteChatMenu = ({ anchor, socket }) => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const menuRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const { isDeleteMenu, chatIdContextMenu } = useSelector((state) => state.misc);
  const { pinnedChats, muteChats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const chatId = chatIdContextMenu;

  const [deleteChat] = useDeleteChatMutation();

  useEffect(() => {
    if (anchor) {
      setPosition({
        left: Math.min(anchor.pageX, window.innerWidth - 200),
        top: Math.min(anchor.pageY, window.innerHeight - 150),
      });
    }
  }, [anchor]);

  const handleDeleteChat = async () => {
    await deleteChat({ id: chatId });
    dispatch(setIsDeleteMenu(false));
  };

  const pinChatHandler = () => {
    socket.emit("pinChat", { pinned: true, userId: user.id, chatId });
    dispatch(setPinnedChats(chatId));
    dispatch(setIsDeleteMenu(false));
  };

  const unPinChatHandler = () => {
    socket.emit("pinChat", { pinned: false, userId: user.id, chatId });
    dispatch(deleteFromPinnedChats(chatId));
    dispatch(setIsDeleteMenu(false));
  };

  const muteChatHandler = () => {
    socket.emit("MUTECHAT", { mute: true, userId: user.id, chatId });
    dispatch(setMuteChats(chatId));
    dispatch(setIsDeleteMenu(false));
  };

  const unMuteChatHandler = () => {
    socket.emit("MUTECHAT", { mute: false, userId: user.id, chatId });
    dispatch(deleteFromMuteChats(chatId));
    dispatch(setIsDeleteMenu(false));
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      dispatch(setIsDeleteMenu(false));
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const menuContent = (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        left: `${position.left}px`,
        top: `${position.top}px`,
        zIndex: 1000,
      }}
      className="bg-card shadow-lg rounded-lg text-card-foreground border border-border w-48"
    >
      <ul className="space-y-1 p-2">
        {pinnedChats?.includes(chatId) ? (
          <li onClick={unPinChatHandler} className="cursor-pointer flex items-center gap-2 p-2 hover:bg-muted">
            <PinOffIcon size={15} /> Unpin
          </li>
        ) : (
          <li onClick={pinChatHandler} className="cursor-pointer flex items-center gap-2 p-2 hover:bg-muted">
            <PinIcon size={15} /> Pin
          </li>
        )}
        {muteChats?.includes(chatId) ? (
          <li onClick={unMuteChatHandler} className="cursor-pointer flex items-center gap-2 p-2 hover:bg-muted">
            <Bell size={15} /> Unmute
          </li>
        ) : (
          <li onClick={muteChatHandler} className="cursor-pointer flex items-center gap-2 p-2 hover:bg-muted">
            <BellOffIcon size={15} /> Mute
          </li>
        )}
        <li onClick={handleDeleteChat} className="cursor-pointer flex items-center gap-2 p-2 text-red-500 hover:bg-muted">
          <TrashIcon size={15} /> Delete Chat
        </li>
      </ul>
    </div>
  );

  return isDeleteMenu ? createPortal(menuContent, document.body) : null;
};

export default DeleteChatMenu;
