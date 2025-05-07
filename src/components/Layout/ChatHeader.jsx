import { setIsChatDetailsBarOpen } from "@/redux/reducers/misc";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Settings2 } from "lucide-react";
import { motion } from "motion/react";

const ChatHeader = ({ user, group }) => {
  const dispatch = useDispatch();
  const { userTyping } = useSelector((state) => state.misc);

  const handleClick = () => {
    dispatch(setIsChatDetailsBarOpen());
  };

  const image = user?.avatar?.url || group?.groupImage || "";
  const name = user?.name || group?.groupname || "Unknown";
  const isOnline = user?.isOnline || false;

  return (
    <header className="bg-card backdrop-blur-sm border border-separate text-card-foreground h-[3.7rem] px-3 py-6 flex justify-between items-center pl-2 border-t-[1px] gap-5">
      <div className="flex bg-card items-center justify-center gap-3">
        <div className="w-10 ring-primary ring-offset-1 ring-2 h-10 rounded-full">
          <Avatar className="w-10 h-10 bg-card">
            <AvatarImage src={image} alt={name} />
            <AvatarFallback className="bg-card text-white">
              {name?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="ml-4 self-start flex-col justify-center">
          <div className="text-base text-card-foreground font-semibold">
            {name}
          </div>
          <div className="text-[10px] h-[2px] text-primary">
            {isOnline && (
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-[10px] text-primary"
              >
                {userTyping ? "typing..." : "Online"}
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <div>
        <Settings2 onClick={handleClick} className="text-primary" size={26} />
      </div>
    </header>
  );
};

export default memo(ChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.user?.id === nextProps.user?.id &&
    prevProps.user?.name === nextProps.user?.name &&
    prevProps.user?.avatar?.url === nextProps.user?.avatar?.url &&
    prevProps.user?.isOnline === nextProps.user?.isOnline &&
    prevProps.group?.groupname === nextProps.group?.groupname &&
    prevProps.group?.groupImage === nextProps.group?.groupImage
  );
});
