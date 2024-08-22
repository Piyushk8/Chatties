import React, { memo } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
 import { motion } from "framer-motion";
 import userAvatar from "../../assets/userAvatar.jpg";

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
  if(!avatar) avatar = userAvatar
  return (
    <Link
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
      className={` ${selected ? "bg-orange-100 shadow-md border-l-4 rounded-l-md border-orange-500 " :""} hover:z-50 hover:bg-orange-50 flex w-full  gap-3 items-center p-4 mb-0.5 relative ${sameSender ? 'bg-[#054640] text-white' : 'bg-transparent text-black'} transition-colors duration-150 ease-in-out`}
    >
      <motion.div
        key={index}
        initial={{ opacity: 0, y: '-100%' }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        className={`flex gap-4 `}
      >
      
      <div class="avatar">
        <div class={` shadow-lg  ring-offset-base-100 w-10 h-10 rounded-full ${isOnline && "ring shadow-orange-300 ring-orange-300 ring-offset-2"} `}>
          <img className="rounded-full h-10 w-10"  src={`${avatar.url||avatar}`} />
        </div>
       
      </div>
        <div>
        <div className="flex gap-4 ">
          <span className="self-start text-xs  text-slate-500 overflow-hidden whitespace-nowrap text-ellipsis">{name} </span>
          <div className=" text-[10px]  text-slate-500 overflow-hidden whitespace-nowrap text-ellipsis">* 11 days ago</div>
        </div>
        <div className=" text-sm text-gray-900 text-ellipsis overflow-y-hidden overflow-x-hidden h-6 ">
           {"~"} {lastMessage}
          </div>

        </div>
        
        {/* {isOnline && (
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 absolute top-1/2 right-4 transform -translate-y-1/2" />
        )} */}
        
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