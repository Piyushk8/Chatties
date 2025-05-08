import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsDeleteMenu, setIsGroupMenuOpen } from "../../redux/reducers/misc";
import { useLeaveGroupMutation } from "../../redux/reducers/api";
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
  Loader,
  PinIcon,
  PinOffIcon,
  TrashIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const GroupContextMenu = ({ anchor, socket }) => {
  const dispatch = useDispatch();
  const dialogRef = useRef(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isGroupMenuOpen, groupIdContextMenu } = useSelector((state) => state.misc);
  const { pinnedChats, muteChats } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [exitGroup, { isLoading }] = useLeaveGroupMutation();

  const handleExitGroup = async () => {
    try {
      const res = await exitGroup({ id: groupIdContextMenu }).unwrap();
      toast({ title: "Success", description: "Left group successfully" });
      setTimeout(() => navigate("/"), 500);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.data?.message || "Failed to leave group",
      });
    }
    dispatch(setIsGroupMenuOpen(false));
  };

  const pinChatHandler = () => {
    dispatch(setIsDeleteMenu(false));
    socket.emit("pinChat", {
      isGroup: true,
      pinned: true,
      userId: user.id,
      groupId: groupIdContextMenu,
    });
    dispatch(setPinnedChats(groupIdContextMenu));
  };

  const unPinChatHandler = () => {
    dispatch(setIsDeleteMenu(false));
    socket.emit("pinChat", {
      isGroup: true,
      pinned: false,
      userId: user.id,
      groupId: groupIdContextMenu,
    });
    dispatch(deleteFromPinnedChats(groupIdContextMenu));
  };

  const muteChatHandler = () => {
    dispatch(setIsDeleteMenu(false));
    socket.emit("MUTECHAT", {
      isGroup: true,
      mute: true,
      userId: user.id,
      groupId: groupIdContextMenu,
    });
    dispatch(setMuteChats(groupIdContextMenu));
  };

  const unMuteChatHandler = () => {
    dispatch(setIsDeleteMenu(false));
    socket.emit("MUTECHAT", {
      isGroup: true,
      mute: false,
      userId: user.id,
      groupId: groupIdContextMenu,
    });
    dispatch(deleteFromMuteChats(groupIdContextMenu));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target)) {
        dispatch(setIsGroupMenuOpen(false));
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [dispatch]);

  return (
    <div
      ref={dialogRef}
      style={{
        position: "fixed",
        left: `${Math.min(anchor.pageX, window.innerWidth - 200)}px`,
        top: `${Math.min(anchor.pageY, window.innerHeight - 150)}px`,
      }}
      className="bg-card border border-border rounded-xl shadow-lg z-50 w-52 text-primary animate-in fade-in"
    >
      <ul className="divide-y divide-border p-1">
        {pinnedChats?.includes(groupIdContextMenu) ? (
          <li
            onClick={unPinChatHandler}
            className="flex items-center justify-between gap-2 p-3 hover:bg-muted rounded-md transition cursor-pointer"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <PinOffIcon size={16} />
              Unpin
            </span>
          </li>
        ) : (
          <li
            onClick={pinChatHandler}
            className="flex items-center justify-between gap-2 p-3 hover:bg-muted rounded-md transition cursor-pointer"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <PinIcon size={16} />
              Pin group
            </span>
          </li>
        )}

        {muteChats?.includes(groupIdContextMenu) ? (
          <li
            onClick={unMuteChatHandler}
            className="flex items-center justify-between gap-2 p-3 hover:bg-muted rounded-md transition cursor-pointer"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <Bell size={16} />
              Unmute group
            </span>
          </li>
        ) : (
          <li
            onClick={muteChatHandler}
            className="flex items-center justify-between gap-2 p-3 hover:bg-muted rounded-md transition cursor-pointer"
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <BellOffIcon size={16} />
              Mute group
            </span>
          </li>
        )}

        <li
          onClick={handleExitGroup}
          className="flex items-center justify-between gap-2 p-3 hover:bg-muted rounded-md transition cursor-pointer text-red-500 font-medium"
        >
          <span className="flex items-center gap-2 text-sm">
            <TrashIcon size={16} />
            Exit group
          </span>
          {isLoading && <Loader className="size-4 animate-spin" />}
        </li>
      </ul>
    </div>
  );
};
