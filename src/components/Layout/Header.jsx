import { setIsChatDetailsBarOpen } from "@/redux/reducers/misc";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { SettingsIcon } from "lucide-react";

const Header = ({ user }) => {
  const dispatch = useDispatch();
  // const {user} = useSelector((state)=>state.auth)
  // const name = chatName.split("-")[0]
  console.log(user);
  const handleClick = (e) => {
    dispatch(setIsChatDetailsBarOpen());
  };

  const { userTyping } = useSelector((state) => state.misc);
  return (
    <>
      <header className="bg-card backdrop-blur-sm border border-separate text-card-foreground h-[3.7rem] px-3 py-6 flex justify-between items-center pl-2 border-t-[1px] gap-5">
        <div className="flex bg-card items-center justify-center gap-3">
            <div class="w-10 ring-primary  ring-offset-1 ring-2 h-10 bg-card rounded-full ">
              <Avatar className="w-10 h-10 bg-card ">
                <AvatarImage src={""} alt={user?.name} />
                <AvatarFallback className={"bg-primary-foreground "} >{user?.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          <div className="ml-4 self-start flex-col justify-center">
            <div className="text-base text-card-foreground font-semibold">
              {user?.name}
            </div>
            <div className="text-sm text-primary">
              {userTyping ? "Typing..." : ""}
            </div>
          </div>
        </div>
        <div>
          <SettingsIcon onClick={handleClick} className="text-primary" size={26}/>
        </div>
      </header>
    </>
  );
};

export default Header;
