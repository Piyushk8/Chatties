import React, { memo, useReducer, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import userAvatar from "../../assets/userAvatar.jpg";
import { timeAgo } from "../../lib/helper";
import { setIsChatList } from "../../redux/reducers/misc";
import { Bookmark, VolumeOffIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const GroupItem = (
    { groupImage,
      groupName,
        selected,
        lastMessage,
        id,
        index = 0,
        handleDeleteChat,
      }
    // ) => {
        
    ) => {
      const dispatch = useDispatch();
      const { pinnedChats, muteChats } = useSelector((state) => state.chat);
      const groupChat = true
      const chatRef = useRef(null);
      // const lastSeenTime = timeAgo(lastSeen);
      // if (!avatar) avatar = userAvatar;
  return (
    <Link
      ref={chatRef}
      to={`/group/${id}`}
      onClick={() => dispatch(setIsChatList())}
      onContextMenu={(e) => handleDeleteChat(e,id, chatRef,groupChat)}
      className={`border-b border-b-accent ${
        selected ? "bg-card  border border-l-4 border-l-primary " : ""
      }   hover:bg-secondary  w-full  px-3 py-3  md:px-[1.4rem] ${
     ""   // sameSender ? "bg-[#054640] text-white" : "bg-transparent text-black"
      } transition-colors duration-150 ease-in-out`}
    >
      <motion.div
        key={index}
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        className={`font-mono flex border-primary-foreground justify-between gap-3 h-16`}
      >
        {/* avatar div */}
        <div className=" flex gap-3">
          <div class="avatar">
            <div
              class={`bg-card shadow-lg  ring-offset-base-100 w-12 h-12 rounded-full`}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={`${groupImage}`}></AvatarImage>
                <AvatarFallback className="dark:bg-card-foreground text-bg">
                  {groupName[0]+"k"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div>
            <div className="flex gap-4 ">
              <span className="dark:text-white self-start text-xs font-bold  text-[#212121] overflow-hidden whitespace-nowrap text-ellipsis">
                {groupName}{" "}
              </span>
                <div className=" flex gap-4">
                              {/* <div className=" text-muted-foreground text-[9px]  text-[#B0B0B0] overflow-hidden whitespace-nowrap text-ellipsis">{lastSeenTime}</div> */}
                              {
                                muteChats?.includes(id)&&(
                                  <div>
                                    <VolumeOffIcon
                                      size={15}
                                      className="text-muted-foreground fill-muted-foreground"
                                    />
                                  </div>
                                )
                              }
                            </div>
            </div>
            <div className=" text-sm h-11  text-gray-400 text-ellipsis overflow-y-hidden overflow-x-hidden  ">
              {lastMessage}
            </div>
          </div>
        </div>
         <div className="flex-col  justify-between space-y-3">
                  {
                    pinnedChats?.includes(id)&& (
                      <div className="">
                        <Bookmark
                          size={16}
                          className="text-muted-foreground fill-muted-foreground"
                        />
                      </div>
                    )
                  }
                  {/* {!!unreadCount && (
                    <div className="text-primary bg-muted text-xs h-5 w-5 rounded-full p-1 flex justify-center items-center">
                      {" "}
                      {unreadCount}
                    </div>
                  )} */}
                </div>
      </motion.div>
    </Link>
  );
};

export default GroupItem;
