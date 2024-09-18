import React, { memo, useReducer, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
 import { motion } from "framer-motion";
 import userAvatar from "../../assets/userAvatar.jpg";
import { timeAgo } from "../../lib/helper";
import { setIsChatList } from "../../redux/reducers/misc";
import DeleteChatMenu from "../Dialogs/deleteChatMenu";

const ChatItem = ({
  selected,
  lastMessage,
  lastSeen,
  avatar,
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  const dispatch = useDispatch()
  const {pinnedChats} = useSelector((state)=>state.chat)

  const chatRef = useRef(null)
  const lastSeenTime = timeAgo(lastSeen)
  if(!avatar) avatar = userAvatar
  
  return (
    <Link
      ref={chatRef}
      to={`/chat/${_id}`}
      onClick={()=>dispatch(setIsChatList())}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
      className={` ${selected ? "bg-[#FEF4F2]   border-l-4  border-l-[#DC4A2D] " :""} border-b-[1px] border-gray-200  hover:bg-[#FEF4F2]  w-full  px-3 py-4 md:py-6 md:px-[1.4rem] ${sameSender ? 'bg-[#054640] text-white' : 'bg-transparent text-black'} transition-colors duration-150 ease-in-out`}
    >
      <motion.div
        key={index}
        initial={{ opacity: 0, y: '-100%' }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        className={`flex gap-3 h-16`}
      >
      
      <div class="avatar">
        <div class={` shadow-lg  ring-offset-base-100 w-12 h-12 rounded-full ${isOnline && "ring shadow-orange-300 ring-orange-300 ring-offset-2"} `}>
          <img className="rounded-full h-12 w-12"  src={`${avatar.url||avatar}`} />
        </div>
       
      </div>
        <div>
        <div className="flex gap-4 ">
          <span className="self-start text-xs font-bold  text-[#212121] overflow-hidden whitespace-nowrap text-ellipsis">{name} </span>
          <div className=" text-[9px]  text-[#B0B0B0] overflow-hidden whitespace-nowrap text-ellipsis">{lastSeenTime}</div>
        </div>
        <div className=" text-sm h-11  text-[#454545] text-ellipsis overflow-y-hidden overflow-x-hidden  ">
           {"~"} {lastMessage}
          </div>
        
        </div>
       {
        pinnedChats?.includes(_id) &&  <div className="">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="size-5">
        <path stroke-linecap="sharp" stroke-linejoin="sharp" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>

      </div>
       }
        
       {/* <DeleteChatMenu/> */}
        
      </motion.div>
   
      </Link>
  );
};

export default memo(ChatItem);



// <div class="avatar online placeholder">
//   <div class="bg-neutral text-neutral-content w-16 rounded-full">
//     <span class="text-xl">AI</span>
//   </div>
// </div>