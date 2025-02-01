import { setIsChatDetailsBarOpen } from "@/redux/reducers/misc";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Settings2, SettingsIcon } from "lucide-react";
import { motion } from "framer-motion";
const ChatHeader = ({ user, group }) => {
  const dispatch = useDispatch();

  const [Image, setImage] = useState(
    user?.avatar?.url || group?.groupImage || ""
  );
  const [Name, setName] = useState(user?.name || group?.groupname);
  const [IsOnline, setOnline] = useState(user?.isOnline || group?.groupname);

  const handleClick = (e) => {
    dispatch(setIsChatDetailsBarOpen());
  };

  const { userTyping } = useSelector((state) => state.misc);
  return (
    <>
      <header className="bg-card backdrop-blur-sm border border-separate text-card-foreground h-[3.7rem] px-3 py-6 flex justify-between items-center pl-2 border-t-[1px] gap-5">
        <div className="flex bg-card items-center justify-center gap-3">
          <div class="w-10 ring-primary  ring-offset-1 ring-2 h-10  rounded-full ">
            <Avatar className="w-10 h-10 bg-card ">
              <AvatarImage src={Image} alt={""} />
              <AvatarFallback className={"bg-card text-white "}>
                {Name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="ml-4 self-start flex-col justify-center">
            <div className="text-base text-card-foreground font-semibold">
              {Name}
            </div>
            <div className="text-[10px] h-[2px] text-primary">
              {IsOnline && (
                <motion.div  // This makes sure the animation plays when status changes
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-[10px] text-primary">
                  {userTyping ? "typing..." : ""}
                </motion.div>
              )}
            </div>
          </div>
        </div>
        <div>
          <Settings2 onClick={handleClick} className="text-primary" size={26} />
        </div>
      </header>
    </>
  );
};

export default ChatHeader;
